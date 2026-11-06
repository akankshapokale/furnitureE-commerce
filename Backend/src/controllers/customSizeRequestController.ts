import { randomBytes } from "crypto";
import { Request, Response } from "express";
import { pool } from "../config/db";

const STATUSES = ["Pending", "Under Review", "Quotation Sent", "Approved", "Rejected"] as const;

export const createCustomSizeRequest = async (req: Request, res: Response) => {
  const { length, width, height } = req.body || {};
  const productId = Number(req.body?.productId);
  const dimensions = [length, width, height].map((value) =>
    typeof value === "string" && value.trim() !== "" ? Number(value) : Number.NaN
  );

  if (dimensions.some((value) => !Number.isFinite(value) || value <= 0 || value > 100000)) {
    return res.status(400).json({ success: false, message: "Enter valid positive Length, Width, and Height values." });
  }
  if (!Number.isSafeInteger(productId) || productId <= 0) {
    return res.status(400).json({ success: false, message: "A valid product is required for this request." });
  }

  try {
    const userResult = await pool.query(
      `SELECT id, name, email, phone, role, is_active FROM users WHERE id = $1`,
      [req.user!.id]
    );
    const user = userResult.rows[0];
    if (!user || !user.is_active || user.role !== "customer") {
      return res.status(403).json({ success: false, message: "An active customer account is required." });
    }

    const productResult = await pool.query(
      `SELECT p.id, p.name,
        (SELECT pi.image_url FROM product_images pi
         WHERE pi.product_id = p.id ORDER BY pi.is_primary DESC, pi.display_order ASC, pi.id ASC LIMIT 1) AS product_image
       FROM products p WHERE p.id = $1 AND p.status = 'active'`,
      [productId]
    );
    const product = productResult.rows[0];
    if (!product) return res.status(404).json({ success: false, message: "This product is unavailable." });

    const requestId = `CSR-${Date.now()}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const result = await pool.query(
      `INSERT INTO custom_size_requests
        (request_id, customer_id, customer_name, customer_email, customer_phone,
         product_id, product_name, product_image, length_cm, width_cm, height_cm)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [requestId, user.id, user.name, user.email, user.phone, product.id, product.name,
        product.product_image, ...dimensions]
    );

    return res.status(201).json({ success: true, message: "Custom size request submitted.", data: result.rows[0] });
  } catch (error) {
    console.error("Create custom size request error:", error);
    return res.status(500).json({ success: false, message: "Could not submit the custom size request. Please try again." });
  }
};

export const getMyCustomSizeRequests = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM custom_size_requests WHERE customer_id = $1 ORDER BY created_at DESC`,
      [req.user!.id]
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Get customer custom size requests error:", error);
    return res.status(500).json({ success: false, message: "Could not load custom size requests." });
  }
};

export const getCustomSizeRequests = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM custom_size_requests ORDER BY created_at DESC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Get custom size requests error:", error);
    return res.status(500).json({ success: false, message: "Could not load custom size requests." });
  }
};

export const updateCustomSizeRequest = async (req: Request, res: Response) => {
  const { status, admin_remarks, quotation_amount, quotation_details } = req.body || {};
  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: "Choose a valid request status." });
  }
  const hasAmount = quotation_amount !== undefined && quotation_amount !== "" && quotation_amount !== null;
  const amount = hasAmount ? Number(quotation_amount) : null;
  if (hasAmount && (amount === null || !Number.isFinite(amount) || amount < 0)) {
    return res.status(400).json({ success: false, message: "Quotation amount must be a valid non-negative number." });
  }
  if (status === "Quotation Sent" && (!hasAmount || typeof quotation_details !== "string" || !quotation_details.trim())) {
    return res.status(400).json({ success: false, message: "Add the quotation amount and details before sending the quotation." });
  }

  try {
    const result = await pool.query(
      `UPDATE custom_size_requests SET
         status = COALESCE($2, status),
         admin_remarks = CASE WHEN $3::boolean THEN $4 ELSE admin_remarks END,
         quotation_amount = CASE WHEN $5::boolean THEN $6::numeric ELSE quotation_amount END,
         quotation_details = CASE WHEN $7::boolean THEN $8 ELSE quotation_details END,
         quotation_sent_at = CASE WHEN $2 = 'Quotation Sent' THEN NOW() ELSE quotation_sent_at END,
         updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [req.params.id, status ?? null, admin_remarks !== undefined, admin_remarks ?? null,
        quotation_amount !== undefined, amount, quotation_details !== undefined, quotation_details ?? null]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: "Custom size request not found." });
    return res.json({ success: true, message: "Custom size request updated.", data: result.rows[0] });
  } catch (error) {
    console.error("Update custom size request error:", error);
    return res.status(500).json({ success: false, message: "Could not update the custom size request." });
  }
};

export const decideCustomSizeQuotation = async (req: Request, res: Response) => {
  const decision = req.body?.decision;
  if (decision !== "Accepted" && decision !== "Rejected") {
    return res.status(400).json({ success: false, message: "Choose whether to accept or reject the quotation." });
  }
  try {
    const result = await pool.query(
      `UPDATE custom_size_requests
       SET customer_decision = $3,
           status = CASE WHEN $3 = 'Accepted' THEN 'Approved' ELSE 'Rejected' END,
           customer_decided_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND customer_id = $2 AND status = 'Quotation Sent'
       RETURNING *`,
      [req.params.id, req.user!.id, decision]
    );
    if (!result.rows[0]) {
      return res.status(409).json({ success: false, message: "This quotation is no longer awaiting your decision." });
    }
    return res.json({ success: true, message: decision === "Accepted" ? "Quotation accepted." : "Quotation rejected.", data: result.rows[0] });
  } catch (error) {
    console.error("Decide custom size quotation error:", error);
    return res.status(500).json({ success: false, message: "Could not save your quotation decision." });
  }
};
