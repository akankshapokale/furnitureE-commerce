
import { Request, Response } from "express";
import { pool } from "../config/db";

const asText = (value: unknown, max = 2000): string | null =>
  typeof value === "string" && value.trim().length > 0 && value.trim().length <= max
    ? value.trim()
    : null;

const validId = (value: unknown): value is string => typeof value === "string" && /^\d+$/.test(value) && Number(value) > 0;

const bannerValues = (body: Record<string, unknown>, partial = false) => {
  const title = asText(body.title, 255);
  const imageUrl = asText(body.image_url, 2048);
  if ((!partial || body.title !== undefined) && !title) return { error: "Title is required (max 255 characters)" };
  if ((!partial || body.image_url !== undefined) && !imageUrl) return { error: "A valid image URL is required" };
  if (body.is_active !== undefined && typeof body.is_active !== "boolean") return { error: "is_active must be a boolean" };
  for (const key of ["eyebrow", "button_text"] as const) {
    if (body[key] !== undefined && body[key] !== null && typeof body[key] !== "string") return { error: `${key} must be a string` };
  }
  for (const key of ["description", "button_link"] as const) {
    if (body[key] !== undefined && body[key] !== null && typeof body[key] !== "string") return { error: `${key} must be a string` };
  }
  return { values: {
    eyebrow: body.eyebrow === undefined ? undefined : String(body.eyebrow ?? "").trim().slice(0, 100),
    title,
    description: body.description === undefined ? undefined : String(body.description ?? "").trim(),
    image_url: imageUrl,
    button_text: body.button_text === undefined ? undefined : String(body.button_text ?? "").trim().slice(0, 100),
    button_link: body.button_link === undefined ? undefined : String(body.button_link ?? "").trim().slice(0, 2048),
    is_active: body.is_active as boolean | undefined,
  } };
};


export const getHeroBanners = async (_req: Request, res: Response) => {
  try {
    res.set({ "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate", Pragma: "no-cache", Expires: "0" });
    const result = await pool.query(
      `SELECT * FROM hero_banners WHERE is_active = true ORDER BY id ASC`
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get hero banners error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hero banners",
    });
  }
};

export const getHeroBannersForAdmin = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM hero_banners ORDER BY id ASC`);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Get hero banners for admin error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch hero banners" });
  }
};

export const addHeroBanner = async (req: Request, res: Response) => {
  try {
    const parsed = bannerValues(req.body ?? {});
    if (parsed.error || !parsed.values) return res.status(400).json({ success: false, message: parsed.error });
    const { eyebrow, title, description, image_url, button_text, button_link, is_active } = parsed.values;

    const result = await pool.query(
      `INSERT INTO hero_banners 
        (eyebrow, title, description, image_url, button_text, button_link, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        eyebrow || "NEW COLLECTION", title, description || "", image_url,
        button_text || "Shop Now", button_link || "/shop", is_active ?? true,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Hero banner added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Add hero banner error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add hero banner",
    });
  }
};

export const updateHeroBanner = async (req: Request, res: Response) => {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid banner id" });
  const parsed = bannerValues(req.body ?? {}, true);
  if (parsed.error || !parsed.values) return res.status(400).json({ success: false, message: parsed.error });
  const { values } = parsed;
  try {
    const result = await pool.query(
      `UPDATE hero_banners SET
        eyebrow = COALESCE($1, eyebrow), title = COALESCE($2, title),
        description = COALESCE($3, description), image_url = COALESCE($4, image_url),
        button_text = COALESCE($5, button_text), button_link = COALESCE($6, button_link),
        is_active = COALESCE($7, is_active)
       WHERE id = $8 RETURNING *`,
      [values.eyebrow, values.title, values.description, values.image_url, values.button_text, values.button_link, values.is_active, Number(req.params.id)]
    );
    if (!result.rowCount) return res.status(404).json({ success: false, message: "Hero banner not found" });
    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Update hero banner error:", error);
    return res.status(500).json({ success: false, message: "Failed to update hero banner" });
  }
};

export const deleteHeroBanner = async (req: Request, res: Response) => {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid banner id" });
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM hero_banners WHERE id = $1 RETURNING id`, [id]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: "Hero banner not found" });

    return res.status(200).json({
      success: true,
      message: "Hero banner deleted successfully",
    });
  } catch (error) {
    console.error("Delete hero banner error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete hero banner",
    });
  }
};

export const getWebsiteSettings = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT * FROM website_settings WHERE is_active = TRUE ORDER BY id ASC`
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get website settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch website settings",
    });
  }
};

export const getWebsiteSettingsForAdmin = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM website_settings ORDER BY id ASC`);
    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Get website settings for admin error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch website settings" });
  }
};

export const updateWebsiteSetting = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      section_key,
      heading,
      description,
      image_url,
      button_text,
      button_link,
      is_active,
    } = req.body;

    const allowedSections = [
      "homepage_hero",
      "featured_products",
      "best_sellers",
      "new_arrivals",
      "categories",
      "announcement_bar",
      "contact_information",
      "website_footer",
    ];

    if (
      typeof section_key !== "string" ||
      !allowedSections.includes(section_key)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing section_key",
      });
    }

    if (typeof heading !== "string") {
      return res.status(400).json({
        success: false,
        message: "heading must be a string",
      });
    }

    for (const field of ["description", "image_url", "button_text", "button_link"] as const) {
      if (req.body[field] !== undefined && req.body[field] !== null && typeof req.body[field] !== "string") {
        return res.status(400).json({ success: false, message: `${field} must be a string` });
      }
    }

    if (
      is_active !== undefined &&
      typeof is_active !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "is_active must be a boolean",
      });
    }

    const result = await pool.query(
      `INSERT INTO website_settings
        (
          section_key,
          heading,
          description,
          image_url,
          button_text,
          button_link,
          is_active,
          updated_at
        )
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       ON CONFLICT (section_key)
       DO UPDATE SET
         heading = EXCLUDED.heading,
         description = EXCLUDED.description,
         image_url = EXCLUDED.image_url,
         button_text = EXCLUDED.button_text,
         button_link = EXCLUDED.button_link,
         is_active = EXCLUDED.is_active,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        section_key,
        heading,
        description ?? "",
        image_url ?? "",
        button_text ?? "",
        button_link ?? "",
        is_active ?? true,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Website setting saved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update website setting error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save website setting",
    });
  }
};
