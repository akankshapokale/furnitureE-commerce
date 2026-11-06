import { Request, Response } from "express";
import { PoolClient } from "pg";
import { pool } from "../config/db";

const STATUSES = ["active", "draft", "archived"];

type SpecInput = { label?: unknown; value?: unknown };
type ImageInput = { image_url?: unknown; alt_text?: unknown; is_primary?: unknown };
type VariantInput = {
  variant_name?: unknown;
  sku?: unknown;
  price?: unknown;
  stock_quantity?: unknown;
  attributes?: unknown;
  is_active?: unknown;
};

type ParsedVariant = {
  variant_name: string;
  sku: string | null;
  price: number | null;
  stock_quantity: number;
  attributes: Record<string, string>;
  is_active: boolean;
};

const text = (value: unknown) =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : null;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
};

// Shape + validate the request body. Returns an error message or the clean values.
const parseProduct = (body: Record<string, unknown>) => {
  const name = text(body.name);
  const price = toNumber(body.price);
  const discountPrice = toNumber(body.discount_price);
  const stock = toNumber(body.stock_quantity) ?? 0;
  const categoryId = toNumber(body.category_id);
  const status = text(body.status) ?? "active";
  const catalogRating = toNumber(body.catalog_rating);
  const catalogRatingCount = toNumber(body.catalog_rating_count) ?? 0;

  if (!name) return { error: "Product name is required" };
  if (!categoryId) return { error: "Please choose a category" };
  if (price === null || Number.isNaN(price) || price < 0) {
    return { error: "A valid price is required" };
  }
  if (discountPrice !== null && (Number.isNaN(discountPrice) || discountPrice < 0)) {
    return { error: "Selling price is not valid" };
  }
  if (discountPrice !== null && discountPrice > price) {
    return { error: "Selling price cannot be higher than the regular price" };
  }
  if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    return { error: "Stock must be a whole number, 0 or more" };
  }
  if (!STATUSES.includes(status)) {
    return { error: `Status must be one of: ${STATUSES.join(", ")}` };
  }
  if (catalogRating !== null && (Number.isNaN(catalogRating) || catalogRating < 0 || catalogRating > 5)) {
    return { error: "Website rating must be between 0 and 5" };
  }
  if (Number.isNaN(catalogRatingCount) || catalogRatingCount < 0 || !Number.isInteger(catalogRatingCount)) {
    return { error: "Rating count must be a whole number, 0 or more" };
  }

  const highlights = (Array.isArray(body.highlights) ? body.highlights : [])
    .map((item: unknown) => text(item))
    .filter((item): item is string => !!item);

  const infoSections = (Array.isArray(body.info_sections) ? body.info_sections : [])
    .map((section: { title?: unknown; content?: unknown }) => ({
      title: text(section?.title),
      content: text(section?.content),
    }))
    .filter((section) => section.title && section.content);

  const relatedIds = (Array.isArray(body.related_product_ids) ? body.related_product_ids : [])
    .map((value: unknown) => Number(value))
    .filter((value: number, index: number, list: number[]) => Number.isInteger(value) && value > 0 && list.indexOf(value) === index);

  const specifications = (Array.isArray(body.specifications) ? body.specifications : [])
    .map((spec: SpecInput) => ({ label: text(spec?.label), value: text(spec?.value) }))
    .filter((spec) => spec.label && spec.value);

  const images = (Array.isArray(body.images) ? body.images : [])
    .map((image: ImageInput) => ({
      image_url: text(image?.image_url),
      alt_text: text(image?.alt_text),
      is_primary: image?.is_primary === true,
    }))
    .filter((image) => image.image_url);

  // Exactly one primary image (the first one unless the admin picked another).
  if (images.length > 0) {
    const primary = images.findIndex((image) => image.is_primary);
    images.forEach((image, index) => {
      image.is_primary = index === (primary === -1 ? 0 : primary);
    });
  }

  const variants: ParsedVariant[] = [];

  for (const raw of Array.isArray(body.variants) ? (body.variants as VariantInput[]) : []) {
    const variantName = text(raw?.variant_name);
    if (!variantName) continue;

    const variantPrice = toNumber(raw.price);
    const variantStock = toNumber(raw.stock_quantity) ?? 0;

    if (variantPrice !== null && (Number.isNaN(variantPrice) || variantPrice < 0)) {
      return { error: `Variant "${variantName}" has an invalid price` };
    }
    if (Number.isNaN(variantStock) || variantStock < 0 || !Number.isInteger(variantStock)) {
      return { error: `Variant "${variantName}" has an invalid stock value` };
    }

    const attributes: Record<string, string> = {};
    if (raw.attributes && typeof raw.attributes === "object") {
      Object.entries(raw.attributes as Record<string, unknown>).forEach(([key, value]) => {
        if (text(key) && text(value)) attributes[key.trim()] = String(value).trim();
      });
    }

    variants.push({
      variant_name: variantName,
      sku: text(raw.sku),
      price: variantPrice,
      stock_quantity: variantStock,
      attributes,
      is_active: raw.is_active !== false,
    });
  }

  return {
    values: {
      category_id: categoryId,
      sub_category_id: toNumber(body.sub_category_id) || null,
      name,
      slug: slugify(text(body.slug) ?? name),
      short_description: text(body.short_description),
      description: text(body.description),
      price,
      discount_price: discountPrice,
      sku: text(body.sku),
      stock_quantity: stock,
      status,
      is_featured: body.is_featured === true,
      badge: text(body.badge),
      catalog_rating: catalogRating,
      catalog_rating_count: catalogRatingCount,
      specifications,
      highlights,
      info_sections: infoSections,
      related_product_ids: relatedIds,
    },
    images,
    variants,
  };
};

// Replace a product's images and variants in one go (the form always sends the full set).
const saveRelations = async (
  client: PoolClient,
  productId: number,
  images: { image_url: string | null; alt_text: string | null; is_primary: boolean }[],
  variants: ParsedVariant[]
) => {
  await client.query(`DELETE FROM product_images WHERE product_id = $1`, [productId]);
  await client.query(`DELETE FROM product_variants WHERE product_id = $1`, [productId]);

  for (const [index, image] of images.entries()) {
    await client.query(
      `INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
       VALUES ($1, $2, $3, $4, $5)`,
      [productId, image.image_url, image.alt_text, index, image.is_primary]
    );
  }

  for (const variant of variants) {
    await client.query(
      `INSERT INTO product_variants
         (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        productId,
        variant.variant_name,
        variant.sku,
        variant.price,
        variant.stock_quantity,
        JSON.stringify(variant.attributes),
        variant.is_active,
      ]
    );
  }
};

const PRODUCT_COLUMNS = `
  p.id,
  p.category_id,
  p.sub_category_id,
  p.name,
  p.slug,
  p.short_description,
  p.description,
  p.price,
  p.discount_price,
  p.sku,
  p.stock_quantity,
  p.status,
  p.is_featured,
  p.badge,
  p.catalog_rating,
  p.catalog_rating_count,
  p.specifications,
  p.highlights,
  p.info_sections,
  p.related_product_ids,
  p.created_at,
  p.updated_at`;

// Translate unique-constraint violations into messages an admin can act on.
const friendlyError = (error: any, fallback: string) => {
  if (error?.code === "23505") {
    const detail: string = error.detail || "";
    if (detail.includes("(slug)")) {
      return { status: 409, message: "Another product already uses this URL slug" };
    }
    if (detail.includes("(sku)")) {
      return { status: 409, message: "That SKU is already used by another product or variant" };
    }
  }
  if (error?.code === "23503") {
    return { status: 400, message: "The chosen category or sub-category no longer exists" };
  }
  return { status: 500, message: fallback };
};

// CREATE PRODUCT
export const createProduct = async (req: Request, res: Response) => {
  const parsed = parseProduct(req.body ?? {});

  if ("error" in parsed) {
    return res.status(400).json({ success: false, message: parsed.error });
  }

  const { values, images, variants } = parsed;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO products
         (category_id, sub_category_id, name, slug, short_description, description, price,
          discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating,
          catalog_rating_count, specifications, highlights, info_sections, related_product_ids)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
       RETURNING id`,
      [
        values.category_id,
        values.sub_category_id,
        values.name,
        values.slug,
        values.short_description,
        values.description,
        values.price,
        values.discount_price,
        values.sku,
        values.stock_quantity,
        values.status,
        values.is_featured,
        values.badge,
        values.catalog_rating,
        values.catalog_rating_count,
        JSON.stringify(values.specifications),
        JSON.stringify(values.highlights),
        JSON.stringify(values.info_sections),
        values.related_product_ids,
      ]
    );

    await saveRelations(client, result.rows[0].id, images, variants);
    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { id: result.rows[0].id },
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Create product error:", error);

    const { status, message } = friendlyError(error, "Failed to create product");
    res.status(status).json({ success: false, message });
  } finally {
    client.release();
  }
};

// GET ALL PRODUCTS  (?status=active limits the list, e.g. for the storefront)
export const getProducts = async (req: Request, res: Response, includeDrafts = false) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const requestedStatus = typeof req.query.status === "string" ? req.query.status : null;
    const status = includeDrafts ? requestedStatus : "active";

    const result = await pool.query(
      `SELECT
         ${PRODUCT_COLUMNS},
         c.name AS category_name,
         sc.name AS sub_category_name,
         (SELECT image_url FROM product_images i
           WHERE i.product_id = p.id
           ORDER BY i.is_primary DESC, i.display_order, i.id LIMIT 1) AS image_url,
         (SELECT COUNT(*)::int FROM product_images i WHERE i.product_id = p.id) AS image_count,
         COALESCE((SELECT ROUND(AVG(r.rating)::numeric, 1) FROM product_reviews r WHERE r.product_id = p.id AND r.status = 'approved'), p.catalog_rating) AS rating_avg,
         COALESCE(NULLIF((SELECT COUNT(*)::int FROM product_reviews r WHERE r.product_id = p.id AND r.status = 'approved'), 0), p.catalog_rating_count) AS rating_count,
         (SELECT COUNT(*)::int FROM product_variants v WHERE v.product_id = p.id) AS variant_count,
         COALESCE((SELECT json_agg(json_build_object(
           'id', i.id, 'image_url', i.image_url, 'alt_text', i.alt_text,
           'display_order', i.display_order, 'is_primary', i.is_primary
         ) ORDER BY i.display_order, i.id) FROM product_images i WHERE i.product_id = p.id), '[]'::json) AS images,
         COALESCE((SELECT json_agg(json_build_object(
           'id', v.id, 'variant_name', v.variant_name, 'sku', v.sku, 'price', v.price,
           'stock_quantity', v.stock_quantity, 'attributes', COALESCE(v.attributes, '{}'::jsonb),
           'is_active', v.is_active
         ) ORDER BY v.id) FROM product_variants v WHERE v.product_id = p.id AND ($2::boolean OR v.is_active = TRUE)), '[]'::json) AS variants
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       LEFT JOIN sub_categories sc ON sc.id = p.sub_category_id
       WHERE ($1::text IS NULL OR p.status = $1)
         AND ($2::boolean OR (c.is_active = TRUE AND (p.sub_category_id IS NULL OR sc.is_active = TRUE)))
       ORDER BY p.id DESC`,
      [status, includeDrafts]
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// GET PRODUCT BY ID (with images and variants)
export const getProductById = async (req: Request, res: Response, includeDrafts = false) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         ${PRODUCT_COLUMNS},
         c.name AS category_name,
         sc.name AS sub_category_name,
         COALESCE((SELECT ROUND(AVG(r.rating)::numeric, 1) FROM product_reviews r
           WHERE r.product_id = p.id AND r.status = 'approved'), p.catalog_rating) AS rating_avg,
         COALESCE(NULLIF((SELECT COUNT(*)::int FROM product_reviews r
           WHERE r.product_id = p.id AND r.status = 'approved'), 0), p.catalog_rating_count) AS rating_count,
         COALESCE((
           SELECT json_agg(json_build_object(
             'id', i.id, 'image_url', i.image_url, 'alt_text', i.alt_text,
             'display_order', i.display_order, 'is_primary', i.is_primary
           ) ORDER BY i.display_order, i.id)
           FROM product_images i WHERE i.product_id = p.id
         ), '[]'::json) AS images,
         COALESCE((
           SELECT json_agg(json_build_object(
             'id', v.id, 'variant_name', v.variant_name, 'sku', v.sku, 'price', v.price,
             'stock_quantity', v.stock_quantity, 'attributes', COALESCE(v.attributes, '{}'::jsonb),
             'is_active', v.is_active
           ) ORDER BY v.id)
           FROM product_variants v WHERE v.product_id = p.id AND ($2::boolean OR v.is_active = TRUE)
         ), '[]'::json) AS variants
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       LEFT JOIN sub_categories sc ON sc.id = p.sub_category_id
       WHERE p.id = $1 AND ($2::boolean OR (p.status = 'active' AND c.is_active = TRUE AND (p.sub_category_id IS NULL OR sc.is_active = TRUE)))`,
      [id, includeDrafts]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error("Get product by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req: Request, res: Response) => {
  const parsed = parseProduct(req.body ?? {});

  if ("error" in parsed) {
    return res.status(400).json({ success: false, message: parsed.error });
  }

  const { values, images, variants } = parsed;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE products SET
         category_id = $1, sub_category_id = $2, name = $3, slug = $4,
         short_description = $5, description = $6, price = $7, discount_price = $8,
         sku = $9, stock_quantity = $10, status = $11, is_featured = $12,
         badge = $13, catalog_rating = $14, catalog_rating_count = $15,
         specifications = $16, highlights = $17, info_sections = $18,
         related_product_ids = $19, updated_at = NOW()
       WHERE id = $20
       RETURNING id`,
      [
        values.category_id,
        values.sub_category_id,
        values.name,
        values.slug,
        values.short_description,
        values.description,
        values.price,
        values.discount_price,
        values.sku,
        values.stock_quantity,
        values.status,
        values.is_featured,
        values.badge,
        values.catalog_rating,
        values.catalog_rating_count,
        JSON.stringify(values.specifications),
        JSON.stringify(values.highlights),
        JSON.stringify(values.info_sections),
        values.related_product_ids,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await saveRelations(client, result.rows[0].id, images, variants);
    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { id: result.rows[0].id },
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Update product error:", error);

    const { status, message } = friendlyError(error, "Failed to update product");
    res.status(status).json({ success: false, message });
  } finally {
    client.release();
  }
};

// SIMILAR PRODUCTS: the ones picked in the CMS, topped up with the same category.
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 4, 12);

    const base = await pool.query(
      `SELECT id, category_id, related_product_ids FROM products WHERE id = $1`,
      [req.params.id]
    );

    if (base.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const { category_id, related_product_ids } = base.rows[0];

    const result = await pool.query(
      `SELECT
         p.id, p.name, p.slug, p.price, p.discount_price, p.short_description,
         c.name AS category_name,
         (SELECT image_url FROM product_images i
           WHERE i.product_id = p.id
           ORDER BY i.is_primary DESC, i.display_order, i.id LIMIT 1) AS image_url,
         (SELECT ROUND(AVG(r.rating)::numeric, 1) FROM product_reviews r
           WHERE r.product_id = p.id AND r.status = 'approved') AS rating_avg,
         (SELECT COUNT(*)::int FROM product_reviews r
           WHERE r.product_id = p.id AND r.status = 'approved') AS rating_count
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.status = 'active' AND p.id <> $1
       ORDER BY
         COALESCE(array_position($2::int[], p.id), 1000),
         (p.category_id = $3) DESC,
         p.is_featured DESC,
         p.id
       LIMIT $4`,
      [req.params.id, related_product_ids, category_id, limit]
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error("Get related products error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch similar products" });
  }
};

// QUICK STATUS CHANGE (publish / draft / archive from the list)
export const updateProductStatus = async (req: Request, res: Response) => {
  const status = text(req.body?.status);

  if (!status || !STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${STATUSES.join(", ")}`,
    });
  }

  try {
    const result = await pool.query(
      `UPDATE products SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, status`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error("Update product status error:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `DELETE FROM products WHERE id = $1 RETURNING id, name`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Delete product error:", error);

    // Keep products used by historical orders, but remove them from the public catalogue.
    if (error?.code === "23503") {
      try {
        const archived = await pool.query(
          `UPDATE products SET status = 'archived', updated_at = NOW() WHERE id = $1 RETURNING id, name`,
          [req.params.id]
        );
        if (archived.rows.length === 0) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({
          success: true,
          message: "This product is linked to existing records, so it was archived and removed from the live catalogue.",
          data: { ...archived.rows[0], archived: true },
        });
      } catch (archiveError) {
        console.error("Archive product after delete constraint error:", archiveError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
