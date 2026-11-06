import { Request, Response } from "express";
import { pool } from "../config/db";

const contentKey = /^[a-z0-9][a-z0-9_-]{0,99}$/;

export const getPublishedWebsiteContent = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT content_key, content, updated_at FROM website_content WHERE is_published = TRUE ORDER BY content_key"
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Get published website content error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch website content" });
  }
};

export const getWebsiteContentForAdmin = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT content_key, content, is_published, updated_at FROM website_content ORDER BY content_key"
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Get website content error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch website content" });
  }
};

export const saveWebsiteContent = async (req: Request, res: Response) => {
  const key = typeof req.params.key === "string" ? req.params.key : "";
  const { content, is_published } = req.body ?? {};
  if (!contentKey.test(key)) {
    return res.status(400).json({ success: false, message: "Invalid content key" });
  }
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return res.status(400).json({ success: false, message: "Content must be a JSON object" });
  }
  if (typeof is_published !== "boolean") {
    return res.status(400).json({ success: false, message: "is_published must be a boolean" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO website_content (content_key, content, is_published, updated_at, updated_by) " +
      "VALUES ($1, $2::jsonb, $3, CURRENT_TIMESTAMP, $4) " +
      "ON CONFLICT (content_key) DO UPDATE SET content = EXCLUDED.content, " +
      "is_published = EXCLUDED.is_published, updated_at = CURRENT_TIMESTAMP, updated_by = EXCLUDED.updated_by " +
      "RETURNING content_key, content, is_published, updated_at",
      [key, JSON.stringify(content), is_published, req.staff?.id ?? null]
    );
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Save website content error:", error);
    res.status(500).json({ success: false, message: "Failed to save website content" });
  }
};

export const deleteWebsiteContent = async (req: Request, res: Response) => {
  const key = typeof req.params.key === "string" ? req.params.key : "";
  if (!contentKey.test(key)) {
    return res.status(400).json({ success: false, message: "Invalid content key" });
  }
  try {
    const result = await pool.query("DELETE FROM website_content WHERE content_key = $1 RETURNING content_key", [key]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: "Content not found" });
    res.status(200).json({ success: true, message: "Website content deleted" });
  } catch (error) {
    console.error("Delete website content error:", error);
    res.status(500).json({ success: false, message: "Failed to delete website content" });
  }
};
