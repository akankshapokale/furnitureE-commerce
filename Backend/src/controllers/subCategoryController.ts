import { Request, Response } from "express";
import { pool } from "../config/db";

// CREATE SUB CATEGORY
export const createSubCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      category_id,
      name,
      description,
      image_url,
      group_name,
      is_active,
    } = req.body;

    if (!category_id || !name) {
      return res.status(400).json({
        success: false,
        message: "category_id and name are required",
      });
    }

    const category = await pool.query(
      `SELECT id FROM categories WHERE id = $1`,
      [category_id]
    );

    if (category.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const result = await pool.query(
      `INSERT INTO sub_categories
      (
        category_id,
        name,
        description,
        image_url,
        group_name,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        category_id,
        name,
        description,
        image_url,
        group_name,
        is_active,
        created_at,
        updated_at`,
      [
        category_id,
        name,
        description || null,
        image_url || null,
        group_name || null,
        is_active ?? true,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Sub category created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Create sub category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create sub category",
      error: error.message,
    });
  }
};

// GET ALL SUB CATEGORIES
export const getSubCategories = async (
  _req: Request,
  res: Response,
  includeInactive = false
) => {
  try {
    const result = await pool.query(
      `SELECT
        sc.id,
        sc.category_id,
        c.name AS category_name,
        sc.name,
        sc.description,
        sc.image_url,
        sc.group_name,
        sc.is_active,
        sc.created_at,
        sc.updated_at
       FROM sub_categories sc
       LEFT JOIN categories c
         ON sc.category_id = c.id
       WHERE ($1::boolean OR (sc.is_active = TRUE AND c.is_active = TRUE))
       ORDER BY sc.id DESC`,
      [includeInactive]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Get sub categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch sub categories",
      error: error.message,
    });
  }
};

// GET SUB CATEGORY BY ID
export const getSubCategoryById = async (
  req: Request,
  res: Response,
  includeInactive = false
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        sc.id,
        sc.category_id,
        c.name AS category_name,
        sc.name,
        sc.description,
        sc.image_url,
        sc.group_name,
        sc.is_active,
        sc.created_at,
        sc.updated_at
       FROM sub_categories sc
       LEFT JOIN categories c
         ON sc.category_id = c.id
       WHERE sc.id = $1 AND ($2::boolean OR (sc.is_active = TRUE AND c.is_active = TRUE))`,
      [id, includeInactive]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sub category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Get sub category by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch sub category",
      error: error.message,
    });
  }
};

// UPDATE SUB CATEGORY
export const updateSubCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      category_id,
      name,
      description,
      image_url,
      group_name,
      is_active,
    } = req.body;

    if (category_id) {
      const category = await pool.query(
        `SELECT id FROM categories WHERE id = $1`,
        [category_id]
      );

      if (category.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    const result = await pool.query(
      `UPDATE sub_categories
       SET
         category_id = COALESCE($1, category_id),
         name = COALESCE($2, name),
         description = COALESCE($3, description),
         image_url = COALESCE($4, image_url),
         group_name = COALESCE($5, group_name),
         is_active = COALESCE($6, is_active),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING
         id,
         category_id,
         name,
         description,
         image_url,
         group_name,
         is_active,
         created_at,
         updated_at`,
      [
        category_id ?? null,
        name ?? null,
        description ?? null,
        image_url ?? null,
        group_name ?? null,
        is_active ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sub category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sub category updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Update sub category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update sub category",
      error: error.message,
    });
  }
};

// DELETE SUB CATEGORY
export const deleteSubCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM sub_categories
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sub category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sub category deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete sub category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete sub category",
      error: error.message,
    });
  }
};
