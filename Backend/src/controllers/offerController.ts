
import { Request, Response } from "express";
import { pool } from "../config/db";

// GET ALL OFFERS
export const getOffers = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        o.*,
        p.name AS product_name
      FROM offers o
      LEFT JOIN products p ON p.id = o.product_id
      ORDER BY o.id DESC
    `);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get offers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch offers",
    });
  }
};

// CREATE OFFER
export const createOffer = async (req: Request, res: Response) => {
  try {
    const {
      product_id,
      title,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
      is_active,
    } = req.body;

    if (
      !title ||
      !discount_type ||
      discount_value === undefined ||
      discount_value === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, discount type and discount value are required",
      });
    }

    if (!["percentage", "fixed"].includes(discount_type)) {
      return res.status(400).json({
        success: false,
        message: "discount_type must be percentage or fixed",
      });
    }

    const value = Number(discount_value);

    if (
      !Number.isFinite(value) ||
      value < 0 ||
      (discount_type === "percentage" && value > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount value",
      });
    }

    if (start_date && end_date && new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    const result = await pool.query(
      `INSERT INTO offers
        (product_id, title, description, discount_type, discount_value,
         start_date, end_date, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [
        product_id || null,
        title.trim(),
        description || null,
        discount_type,
        value,
        start_date || null,
        end_date || null,
        is_active ?? true,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Offer created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create offer error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create offer",
    });
  }
};

// UPDATE OFFER
export const updateOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      product_id,
      title,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
      is_active,
    } = req.body;

    if (
      !title ||
      !discount_type ||
      discount_value === undefined ||
      discount_value === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, discount type and discount value are required",
      });
    }

    if (!["percentage", "fixed"].includes(discount_type)) {
      return res.status(400).json({
        success: false,
        message: "discount_type must be percentage or fixed",
      });
    }

    const value = Number(discount_value);

    if (
      !Number.isFinite(value) ||
      value < 0 ||
      (discount_type === "percentage" && value > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount value",
      });
    }

    if (start_date && end_date && new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    const result = await pool.query(
      `UPDATE offers
       SET product_id = $1,
           title = $2,
           description = $3,
           discount_type = $4,
           discount_value = $5,
           start_date = $6,
           end_date = $7,
           is_active = $8,
           updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        product_id || null,
        title.trim(),
        description || null,
        discount_type,
        value,
        start_date || null,
        end_date || null,
        is_active ?? true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update offer error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update offer",
    });
  }
};

// UPDATE OFFER VISIBILITY
export const updateOfferStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_active must be true or false",
      });
    }

    const result = await pool.query(
      `UPDATE offers
       SET is_active = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer status updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
  console.error("Create offer error:", error);

  return res.status(500).json({
    success: false,
    message: "Failed to create offer",
    error: error.message,
    code: error.code,
    detail: error.detail,
  });
}
};
