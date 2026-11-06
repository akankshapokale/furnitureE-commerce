import { Request, Response } from "express";
import { pool } from "../config/db";

const STATUSES = ["pending", "approved", "hidden"];

const text = (value: unknown) =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : null;

const parseRating = (value: unknown) => {
  const rating = Number(value);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null;
};

// PUBLIC: approved reviews of a product plus the rating summary
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await pool.query(
      `SELECT id, reviewer_name, rating, title, comment, is_verified_purchase, created_at
       FROM product_reviews
       WHERE product_id = $1 AND status = 'approved'
       ORDER BY created_at DESC, id DESC`,
      [req.params.id]
    );

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;

    reviews.rows.forEach((row) => {
      distribution[row.rating] += 1;
      total += row.rating;
    });

    const count = reviews.rows.length;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          average: count ? Math.round((total / count) * 10) / 10 : 0,
          count,
          distribution,
        },
        reviews: reviews.rows,
      },
    });
  } catch (error: any) {
    console.error("Get reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

// CUSTOMER: submit a review. It stays pending until staff approve it.
export const createCustomerReview = async (req: Request, res: Response) => {
  const rating = parseRating(req.body?.rating);
  const comment = text(req.body?.comment);

  if (!rating) {
    return res.status(400).json({ success: false, message: "Please choose a rating from 1 to 5" });
  }
  if (!comment || comment.length < 10) {
    return res
      .status(400)
      .json({ success: false, message: "Please write at least a few words about the product" });
  }

  try {
    const user = await pool.query(`SELECT name FROM users WHERE id = $1`, [req.user!.id]);

    if (user.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Account not found" });
    }

    const purchased = await pool.query(
      `SELECT 1
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       WHERE o.user_id = $1 AND oi.product_id = $2
       LIMIT 1`,
      [req.user!.id, req.params.id]
    );

    await pool.query(
      `INSERT INTO product_reviews
         (product_id, user_id, reviewer_name, rating, title, comment, is_verified_purchase, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')`,
      [
        req.params.id,
        req.user!.id,
        user.rows[0].name,
        rating,
        text(req.body?.title)?.slice(0, 160) ?? null,
        comment,
        purchased.rows.length > 0,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Thanks! Your review will appear once it has been approved.",
    });
  } catch (error: any) {
    if (error?.code === "23505") {
      return res
        .status(409)
        .json({ success: false, message: "You have already reviewed this product" });
    }
    if (error?.code === "23503") {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    console.error("Create review error:", error);
    res.status(500).json({ success: false, message: "Failed to submit review" });
  }
};

// STAFF: list reviews (optionally for one product / one status)
export const listReviews = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT r.*, p.name AS product_name
       FROM product_reviews r
       JOIN products p ON p.id = r.product_id
       WHERE ($1::int IS NULL OR r.product_id = $1)
         AND ($2::text IS NULL OR r.status = $2)
       ORDER BY r.created_at DESC, r.id DESC`,
      [req.query.product_id ? Number(req.query.product_id) : null, text(req.query.status)]
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error("List reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

// STAFF: add a review by hand
export const createStaffReview = async (req: Request, res: Response) => {
  const productId = Number(req.body?.product_id);
  const name = text(req.body?.reviewer_name);
  const rating = parseRating(req.body?.rating);
  const status = text(req.body?.status) ?? "approved";

  if (!Number.isInteger(productId) || !name || !rating) {
    return res.status(400).json({
      success: false,
      message: "Product, reviewer name and a rating from 1 to 5 are required",
    });
  }
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO product_reviews
         (product_id, reviewer_name, rating, title, comment, is_verified_purchase, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        productId,
        name,
        rating,
        text(req.body?.title),
        text(req.body?.comment),
        req.body?.is_verified_purchase === true,
        status,
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    if (error?.code === "23503") {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    console.error("Create staff review error:", error);
    res.status(500).json({ success: false, message: "Failed to add review" });
  }
};

// STAFF: edit / moderate a review
export const updateReview = async (req: Request, res: Response) => {
  const rating = req.body?.rating === undefined ? null : parseRating(req.body.rating);
  const status = text(req.body?.status);

  if (req.body?.rating !== undefined && !rating) {
    return res.status(400).json({ success: false, message: "Rating must be from 1 to 5" });
  }
  if (status && !STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const result = await pool.query(
      `UPDATE product_reviews SET
         reviewer_name = COALESCE($1, reviewer_name),
         rating = COALESCE($2, rating),
         title = CASE WHEN $3::boolean THEN $4 ELSE title END,
         comment = CASE WHEN $5::boolean THEN $6 ELSE comment END,
         is_verified_purchase = COALESCE($7, is_verified_purchase),
         status = COALESCE($8, status),
         updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        text(req.body?.reviewer_name),
        rating,
        req.body?.title !== undefined,
        text(req.body?.title),
        req.body?.comment !== undefined,
        text(req.body?.comment),
        typeof req.body?.is_verified_purchase === "boolean" ? req.body.is_verified_purchase : null,
        status,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error("Update review error:", error);
    res.status(500).json({ success: false, message: "Failed to update review" });
  }
};

// STAFF: delete a review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `DELETE FROM product_reviews WHERE id = $1 RETURNING id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error: any) {
    console.error("Delete review error:", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};
