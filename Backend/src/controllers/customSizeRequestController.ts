import { randomBytes } from "crypto";
import { Request, Response } from "express";
import { pool } from "../config/db";

// Helper to record history in custom_size_request_history
async function recordHistory(
  clientOrPool: { query: typeof pool.query },
  requestId: number | string,
  fromStatus: string | null,
  toStatus: string,
  actionByType: "customer" | "admin" | "system",
  actionById: number | null,
  actionByName: string | null,
  remarks: string | null = null,
  metadata: Record<string, unknown> | null = null
) {
  try {
    await clientOrPool.query(
      `INSERT INTO custom_size_request_history
        (request_id, from_status, to_status, action_by_type, action_by_id, action_by_name, remarks, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [requestId, fromStatus, toStatus, actionByType, actionById, actionByName, remarks, metadata ? JSON.stringify(metadata) : null]
    );
  } catch (err) {
    console.error("Failed to record custom size request history:", err);
  }
}

export const createCustomSizeRequest = async (req: Request, res: Response) => {
  const { length, width, height, unit, additional_requirements, reference_image } = req.body || {};
  const productId = Number(req.body?.productId);

  const errors: Record<string, string> = {};

  // 1. Length, Width, Height – Required, numeric, greater than 0
  const parseDim = (val: unknown, fieldName: string) => {
    if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
      errors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
      return Number.NaN;
    }
    const num = Number(val);
    if (!Number.isFinite(num) || num <= 0) {
      errors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be a positive number greater than 0.`;
      return Number.NaN;
    }
    if (num > 10000) {
      errors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} exceeds maximum allowed dimension (10,000 cm).`;
      return Number.NaN;
    }
    return num;
  };

  const len = parseDim(length, "length");
  const w = parseDim(width, "width");
  const h = parseDim(height, "height");

  // 2. Unit – Required; validate against existing available options (CM)
  const allowedUnits = ["CM"];
  const reqUnit = typeof unit === "string" ? unit.trim().toUpperCase() : "CM";
  if (!allowedUnits.includes(reqUnit)) {
    errors.unit = `Unit must be one of: ${allowedUnits.join(", ")}.`;
  }

  // 3. Additional Requirements – Optional, maximum 1000 characters
  let cleanAddReq: string | null = null;
  if (additional_requirements !== undefined && additional_requirements !== null && typeof additional_requirements === "string") {
    cleanAddReq = additional_requirements.trim();
    if (cleanAddReq.length > 1000) {
      errors.additional_requirements = "Additional requirements cannot exceed 1,000 characters.";
    }
  }

  // 4. Reference Image – Optional; validate format
  let refImage: string | null = null;
  if (reference_image !== undefined && reference_image !== null && typeof reference_image === "string" && reference_image.trim()) {
    const trimmed = reference_image.trim();
    const cleanExtMatch = trimmed.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
    const ext = cleanExtMatch ? cleanExtMatch[1].toLowerCase() : "";
    const allowedExts = ["jpg", "jpeg", "png", "webp"];
    if (!allowedExts.includes(ext) && !trimmed.startsWith("data:image/")) {
      errors.reference_image = "Reference image must be a valid JPG, JPEG, PNG, or WEBP file.";
    } else {
      refImage = trimmed;
    }
  }

  // 5. Product ID – Required and must reference an existing product
  if (!Number.isSafeInteger(productId) || productId <= 0) {
    errors.productId = "A valid Product ID is required.";
  }

  // 6. Customer ID – Get strictly from authenticated user token
  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, message: "Authentication required to submit custom size requests." });
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed. Please correct the highlighted errors.",
      errors,
    });
  }

  try {
    const userResult = await pool.query(
      `SELECT id, name, email, phone, role, is_active FROM users WHERE id = $1`,
      [req.user.id]
    );
    const user = userResult.rows[0];
    if (!user || !user.is_active || user.role !== "customer") {
      return res.status(403).json({ success: false, message: "An active customer account is required to submit requests." });
    }

    const productResult = await pool.query(
      `SELECT p.id, p.name,
        (SELECT pi.image_url FROM product_images pi
         WHERE pi.product_id = p.id ORDER BY pi.is_primary DESC, pi.display_order ASC, pi.id ASC LIMIT 1) AS product_image
       FROM products p WHERE p.id = $1 AND p.status = 'active'`,
      [productId]
    );
    const product = productResult.rows[0];
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "The requested product is not available or has been deactivated.",
        errors: { productId: "Product is unavailable or does not exist." },
      });
    }

    // 7. Prevent duplicate submissions: check if the customer already has a pending or under review request with identical dimensions for this product
    const duplicateCheck = await pool.query(
      `SELECT id, request_id, status FROM custom_size_requests
       WHERE customer_id = $1 AND product_id = $2
         AND length_cm = $3 AND width_cm = $4 AND height_cm = $5
         AND status IN ('Pending', 'Under Review')
       LIMIT 1`,
      [user.id, product.id, len, w, h]
    );
    if (duplicateCheck.rows.length > 0) {
      const dup = duplicateCheck.rows[0];
      return res.status(409).json({
        success: false,
        message: `You already have an active request (${dup.request_id}) for this product with identical dimensions. Please check My Custom Size Requests.`,
      });
    }

    const requestId = `CSR-${Date.now()}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const result = await pool.query(
      `INSERT INTO custom_size_requests
        (request_id, customer_id, customer_name, customer_email, customer_phone,
         product_id, product_name, product_image, length_cm, width_cm, height_cm,
         measurement_unit, additional_requirements, reference_image, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'Pending')
       RETURNING *`,
      [
        requestId, user.id, user.name, user.email, user.phone,
        product.id, product.name, product.product_image,
        len, w, h, reqUnit, cleanAddReq, refImage,
      ]
    );

    const created = result.rows[0];
    await recordHistory(
      pool,
      created.id,
      null,
      "Pending",
      "customer",
      user.id,
      user.name,
      `Submitted custom dimensions: ${created.length_cm} × ${created.width_cm} × ${created.height_cm} ${created.measurement_unit}`
    );

    return res.status(201).json({
      success: true,
      message: "Custom size request submitted successfully.",
      data: created,
    });
  } catch (error) {
    console.error("Create custom size request error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not submit the custom size request. Please try again.",
    });
  }
};

export const getMyCustomSizeRequests = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT csr.*,
        COALESCE(
          (SELECT json_agg(h ORDER BY h.created_at ASC)
           FROM custom_size_request_history h
           WHERE h.request_id = csr.id), '[]'::json
        ) AS status_history
       FROM custom_size_requests csr
       WHERE csr.customer_id = $1
       ORDER BY csr.created_at DESC`,
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
      `SELECT csr.*,
        COALESCE(
          (SELECT json_agg(h ORDER BY h.created_at ASC)
           FROM custom_size_request_history h
           WHERE h.request_id = csr.id), '[]'::json
        ) AS status_history
       FROM custom_size_requests csr
       ORDER BY csr.created_at DESC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Get custom size requests error:", error);
    return res.status(500).json({ success: false, message: "Could not load custom size requests." });
  }
};

export const getCustomSizeRequestById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const isStaff = req.user && (req.user.role === "admin" || req.user.role === "staff");
    const query = isStaff
      ? `SELECT csr.*,
          COALESCE(
            (SELECT json_agg(h ORDER BY h.created_at ASC)
             FROM custom_size_request_history h
             WHERE h.request_id = csr.id), '[]'::json
          ) AS status_history
         FROM custom_size_requests csr WHERE csr.id = $1`
      : `SELECT csr.*,
          COALESCE(
            (SELECT json_agg(h ORDER BY h.created_at ASC)
             FROM custom_size_request_history h
             WHERE h.request_id = csr.id), '[]'::json
          ) AS status_history
         FROM custom_size_requests csr WHERE csr.id = $1 AND csr.customer_id = $2`;

    const params = isStaff ? [id] : [id, req.user!.id];
    const result = await pool.query(query, params);
    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: "Custom size request not found." });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Get custom size request details error:", error);
    return res.status(500).json({ success: false, message: "Could not load custom size request details." });
  }
};

// Admin Action 1: Review Request (Pending -> Under Review)
export const reviewCustomSizeRequest = async (req: Request, res: Response) => {
  const { admin_remarks } = req.body || {};
  try {
    const existingResult = await pool.query(`SELECT * FROM custom_size_requests WHERE id = $1`, [req.params.id]);
    const existing = existingResult.rows[0];
    if (!existing) {
      return res.status(404).json({ success: false, message: "Custom size request not found." });
    }

    if (existing.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Only Pending requests can be reviewed. Current status is ${existing.status}.`
      });
    }

    const remarks = typeof admin_remarks === "string" && admin_remarks.trim() ? admin_remarks.trim() : existing.admin_remarks;

    const result = await pool.query(
      `UPDATE custom_size_requests
       SET status = 'Under Review',
           admin_remarks = $2,
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [req.params.id, remarks]
    );

    const updated = result.rows[0];
    const adminUser = req.user;
    await recordHistory(
      pool,
      updated.id,
      existing.status,
      "Under Review",
      "admin",
      adminUser?.id || null,
      ("Admin"),
      remarks || "Request moved to Under Review"
    );

    return res.json({
      success: true,
      message: "Request marked as Under Review.",
      data: updated
    });
  } catch (error) {
    console.error("Review custom size request error:", error);
    return res.status(500).json({ success: false, message: "Could not review this request." });
  }
};

// Admin Action 2: Send Quotation (Under Review -> Quotation Sent)
export const sendCustomSizeQuotation = async (req: Request, res: Response) => {
  const {
    quotation_amount,
    quotation_details,
    additional_charges,
    terms_and_conditions,
    validity_date,
    admin_remarks,
  } = req.body || {};

  // Validations
  const amount = Number(quotation_amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: "Quotation amount must be a valid positive number." });
  }

  if (typeof quotation_details !== "string" || !quotation_details.trim()) {
    return res.status(400).json({ success: false, message: "Quotation details description is required." });
  }

  let addCharges = 0;
  if (additional_charges !== undefined && additional_charges !== "" && additional_charges !== null) {
    addCharges = Number(additional_charges);
    if (!Number.isFinite(addCharges) || addCharges < 0) {
      return res.status(400).json({ success: false, message: "Additional charges must be a non-negative number." });
    }
  }

  let validDate: string | null = null;
  if (validity_date) {
    const parsed = new Date(validity_date);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid validity date." });
    }
    // Date only string YYYY-MM-DD
    validDate = parsed.toISOString().slice(0, 10);
  }

  try {
    const existingResult = await pool.query(`SELECT * FROM custom_size_requests WHERE id = $1`, [req.params.id]);
    const existing = existingResult.rows[0];
    if (!existing) {
      return res.status(404).json({ success: false, message: "Custom size request not found." });
    }

    if (existing.status !== "Under Review") {
      return res.status(400).json({
        success: false,
        message: `Quotation can only be sent when the request is 'Under Review'. Current status is ${existing.status}.`
      });
    }

    const remarks = typeof admin_remarks === "string" ? admin_remarks.trim() : existing.admin_remarks;
    const terms = typeof terms_and_conditions === "string" ? terms_and_conditions.trim() : null;

    const result = await pool.query(
      `UPDATE custom_size_requests
       SET status = 'Quotation Sent',
           quotation_amount = $2,
           quotation_details = $3,
           additional_charges = $4,
           terms_and_conditions = $5,
           validity_date = $6,
           admin_remarks = COALESCE($7, admin_remarks),
           quotation_sent_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [
        req.params.id,
        amount,
        quotation_details.trim(),
        addCharges,
        terms,
        validDate,
        remarks || null,
      ]
    );

    const updated = result.rows[0];
    const adminUser = req.user;
    await recordHistory(
      pool,
      updated.id,
      existing.status,
      "Quotation Sent",
      "admin",
      adminUser?.id || null,
      ("Admin"),
      remarks || `Quotation sent: ₹${amount.toLocaleString("en-IN")}`,
      {
        quotation_amount: amount,
        additional_charges: addCharges,
        validity_date: validDate,
      }
    );

    return res.json({
      success: true,
      message: "Quotation has been successfully sent to the customer.",
      data: updated
    });
  } catch (error) {
    console.error("Send custom size quotation error:", error);
    return res.status(500).json({ success: false, message: "Could not send the quotation." });
  }
};

// Generic update endpoint preserved for backwards compatibility, but enforcing strict workflow
export const updateCustomSizeRequest = async (req: Request, res: Response) => {
  const { status, admin_remarks, quotation_amount, quotation_details, additional_charges, terms_and_conditions, validity_date } = req.body || {};

  // Disallow admin from directly marking Approved or Rejected
  if (status === "Approved" || status === "Rejected") {
    return res.status(403).json({
      success: false,
      message: "Admin cannot approve or reject quotations. Only the customer can accept or reject."
    });
  }

  // If status change is requested, route to the dedicated workflows
  if (status === "Under Review") {
    return reviewCustomSizeRequest(req, res);
  }
  if (status === "Quotation Sent") {
    return sendCustomSizeQuotation(req, res);
  }

  // Otherwise, only allow updating admin_remarks / drafting quotation details without changing status
  try {
    const existingResult = await pool.query(`SELECT * FROM custom_size_requests WHERE id = $1`, [req.params.id]);
    const existing = existingResult.rows[0];
    if (!existing) {
      return res.status(404).json({ success: false, message: "Custom size request not found." });
    }

    const amount = quotation_amount !== undefined && quotation_amount !== "" && quotation_amount !== null
      ? Number(quotation_amount)
      : null;
    const addCharges = additional_charges !== undefined && additional_charges !== "" && additional_charges !== null
      ? Number(additional_charges)
      : null;

    const result = await pool.query(
      `UPDATE custom_size_requests SET
         admin_remarks = CASE WHEN $2::boolean THEN $3 ELSE admin_remarks END,
         quotation_amount = CASE WHEN $4::boolean THEN $5::numeric ELSE quotation_amount END,
         quotation_details = CASE WHEN $6::boolean THEN $7 ELSE quotation_details END,
         additional_charges = CASE WHEN $8::boolean THEN $9::numeric ELSE additional_charges END,
         terms_and_conditions = CASE WHEN $10::boolean THEN $11 ELSE terms_and_conditions END,
         validity_date = CASE WHEN $12::boolean THEN $13::date ELSE validity_date END,
         updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [
        req.params.id,
        admin_remarks !== undefined, admin_remarks ?? null,
        quotation_amount !== undefined, amount,
        quotation_details !== undefined, quotation_details ?? null,
        additional_charges !== undefined, addCharges,
        terms_and_conditions !== undefined, terms_and_conditions ?? null,
        validity_date !== undefined, validity_date ?? null
      ]
    );

    return res.json({ success: true, message: "Custom size request updated.", data: result.rows[0] });
  } catch (error) {
    console.error("Update custom size request error:", error);
    return res.status(500).json({ success: false, message: "Could not update the custom size request." });
  }
};

// Customer Action: Accept or Reject Quotation (Quotation Sent -> Approved | Rejected)
export const decideCustomSizeQuotation = async (req: Request, res: Response) => {
  const { decision, reason } = req.body || {};
  if (decision !== "Accepted" && decision !== "Rejected") {
    return res.status(400).json({ success: false, message: "Choose whether to accept or reject the quotation." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existingResult = await client.query(
      `SELECT * FROM custom_size_requests WHERE id = $1 FOR UPDATE`,
      [req.params.id]
    );
    const existing = existingResult.rows[0];

    if (!existing) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Custom size request not found." });
    }

    // Ownership check
    if (existing.customer_id !== req.user!.id) {
      await client.query("ROLLBACK");
      return res.status(403).json({ success: false, message: "You are not authorized to respond to this quotation." });
    }

    // Prevent duplicate responses & check status
    if (existing.status !== "Quotation Sent") {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: existing.customer_decision
          ? `You have already ${existing.customer_decision.toLowerCase()} this quotation.`
          : `This quotation is currently not awaiting customer decision (Status: ${existing.status}).`
      });
    }

    // Check validity date
    if (existing.validity_date) {
      const today = new Date().toISOString().slice(0, 10);
      const valDate = new Date(existing.validity_date).toISOString().slice(0, 10);
      if (today > valDate) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: "This quotation has expired. Please contact support to request a revised quotation."
        });
      }
    }

    const nextStatus = decision === "Accepted" ? "Approved" : "Rejected";
    const rejectionReason = decision === "Rejected" && typeof reason === "string" ? reason.trim() : null;

    const updateResult = await client.query(
      `UPDATE custom_size_requests
       SET customer_decision = $3,
           status = $4,
           customer_rejection_reason = $5,
           customer_decided_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [existing.id, req.user!.id, decision, nextStatus, rejectionReason]
    );

    const updated = updateResult.rows[0];
    const customerUser = req.user;

    await recordHistory(
      client,
      updated.id,
      existing.status,
      nextStatus,
      "customer",
      customerUser?.id || null,
      existing.customer_name,
      decision === "Accepted" ? "Customer accepted the quotation." : `Customer rejected the quotation.${rejectionReason ? ` Reason: ${rejectionReason}` : ""}`
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: decision === "Accepted" ? "Quotation accepted successfully." : "Quotation rejected.",
      data: updated
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Decide custom size quotation error:", error);
    return res.status(500).json({ success: false, message: "Could not save your quotation decision." });
  } finally {
    client.release();
  }
};
