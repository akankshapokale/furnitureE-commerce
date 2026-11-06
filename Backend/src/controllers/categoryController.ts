import { Request, Response } from "express";
import { pool } from "../config/db";

// CREATE CATEGORY
export const createCategory = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      image_url,
      is_active,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO categories
      (
        name,
        description,
        image_url,
        is_active
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        name,
        description,
        image_url,
        is_active,
        created_at,
        updated_at`,
      [
        name,
        description || null,
        image_url || null,
        is_active ?? true,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Create category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// GET ALL CATEGORIES
export const getCategories = async (
  _req: Request,
  res: Response,
  includeInactive = false
) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        description,
        image_url,
        is_active,
        created_at,
        updated_at
       FROM categories
       WHERE ($1::boolean OR is_active = TRUE)
       ORDER BY id DESC`,
      [includeInactive]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// GET CATEGORY BY ID
export const getCategoryById = async (
  req: Request,
  res: Response,
  includeInactive = false
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        id,
        name,
        description,
        image_url,
        is_active,
        created_at,
        updated_at
       FROM categories
       WHERE id = $1 AND ($2::boolean OR is_active = TRUE)`,
      [id, includeInactive]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Get category by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      image_url,
      is_active,
    } = req.body;

    const result = await pool.query(
      `UPDATE categories
       SET
         name = COALESCE($1, name),
         description = COALESCE($2, description),
         image_url = COALESCE($3, image_url),
         is_active = COALESCE($4, is_active),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING
         id,
         name,
         description,
         image_url,
         is_active,
         created_at,
         updated_at`,
      [
        name ?? null,
        description ?? null,
        image_url ?? null,
        is_active ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Update category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (
  req: Request,
  res: Response
) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const category = await client.query(
      "SELECT id FROM categories WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (category.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const usage = await client.query(
      "SELECT COUNT(*)::int AS product_count FROM products WHERE category_id = $1",
      [id]
    );
    const productCount = Number(usage.rows[0]?.product_count || 0);

    const replacementCategoryId = Number(req.body?.replacement_category_id || 0);

    if (productCount > 0 && replacementCategoryId > 0 && replacementCategoryId !== Number(id)) {
      const replacement = await client.query(
        "SELECT id FROM categories WHERE id = $1 FOR UPDATE",
        [replacementCategoryId]
      );

      if (replacement.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ success: false, message: "Choose a valid destination category." });
      }

      await client.query(
        `UPDATE products
         SET category_id = $1, sub_category_id = NULL, updated_at = CURRENT_TIMESTAMP
         WHERE category_id = $2`,
        [replacementCategoryId, id]
      );
      await client.query("DELETE FROM categories WHERE id = $1", [id]);
      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: `${productCount} product${productCount === 1 ? "" : "s"} moved to the selected category. The category was deleted.`,
        data: { moved_products: productCount },
      });
    }

    if (productCount > 0) {
      await client.query(
        `UPDATE categories SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id]
      );
      await client.query(
        `UPDATE sub_categories SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE category_id = $1`,
        [id]
      );
      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        archived: true,
        message: `This category is used by ${productCount} product${productCount === 1 ? "" : "s"}. It has been archived and hidden from the storefront; reassign those products to permanently delete it.`,
      });
    }

    await client.query("DELETE FROM categories WHERE id = $1", [id]);
    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    await client.query("ROLLBACK").catch(() => undefined);
    console.error("Delete category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  } finally {
    client.release();
  }
};
