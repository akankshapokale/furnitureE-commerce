import { Request, Response } from "express";
import { pool } from "../config/db";
import crypto from "crypto";
import { getRazorpayClient } from "../config/razorpay";

// CREATE RAZORPAY ORDER
export const createPayment = async (req: Request, res: Response) => {
  try {
    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the backend .env file.",
      });
    }

    const {
      order_id,
      amount,
      payment_method = "Razorpay",
    } = req.body;

    if (!order_id || !amount) {
      return res.status(400).json({
        success: false,
        message: "order_id and amount are required",
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `order_${order_id}`,
    });

    // Save initial payment record
    const result = await pool.query(
      `
      INSERT INTO payments
      (
        order_id,
        transaction_id,
        payment_method,
        payment_status,
        amount,
        payment_date,
        failure_reason
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        order_id,
        razorpayOrder.id,
        payment_method,
        "pending",
        amount,
        null,
        null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      data: {
        payment: result.rows[0],
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error: any) {
    console.error("Create Razorpay order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};


// VERIFY RAZORPAY PAYMENT
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keySecret) {
      return res.status(503).json({
        success: false,
        message: "Razorpay is not configured. Add RAZORPAY_KEY_SECRET to the backend .env file.",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const result = await pool.query(
      `
      UPDATE payments
      SET
        transaction_id = $1,
        payment_status = $2,
        payment_date = CURRENT_TIMESTAMP,
        failure_reason = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE transaction_id = $3
      RETURNING *
      `,
      [
        razorpay_payment_id,
        "paid",
        razorpay_order_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};


// GET ALL PAYMENTS
export const getPayments = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        p.*,
        o.order_number
      FROM payments p
      LEFT JOIN orders o
        ON p.order_id = o.id
      ORDER BY p.id DESC
    `);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Get payments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get payments",
      error: error.message,
    });
  }
};


// GET PAYMENT BY ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        p.*,
        o.order_number
      FROM payments p
      LEFT JOIN orders o
        ON p.order_id = o.id
      WHERE p.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Get payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get payment",
      error: error.message,
    });
  }
};


// UPDATE PAYMENT
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      transaction_id,
      payment_method,
      payment_status,
      amount,
      payment_date,
      failure_reason,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE payments
      SET
        transaction_id = $1,
        payment_method = $2,
        payment_status = $3,
        amount = $4,
        payment_date = $5,
        failure_reason = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
      `,
      [
        transaction_id || null,
        payment_method,
        payment_status,
        amount,
        payment_date || null,
        failure_reason || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Update payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update payment",
      error: error.message,
    });
  }
};


// DELETE PAYMENT
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM payments
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Delete payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete payment",
      error: error.message,
    });
  }
};


// Share of the order total collected online for "Partial COD".
const PARTIAL_COD_ADVANCE_RATE = 0.2;

const MOCK_PAYMENT_METHODS: Record<string, string> = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net Banking",
  cod: "Cash on Delivery",
  partial_cod: "Partial COD (Advance)",
};

// POST /api/payments/mock  { order_id, method: upi | card | netbanking | cod | partial_cod }
export const createMockPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const { order_id, method = "card" } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required",
      });
    }

    const methodLabel = MOCK_PAYMENT_METHODS[method];

    if (!methodLabel) {
      return res.status(400).json({
        success: false,
        message: "Unsupported payment method",
      });
    }

    const orderResult = await pool.query(
      `SELECT id, total_amount FROM orders WHERE id = $1`,
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const total = Number(orderResult.rows[0].total_amount);

    // The amount is derived from the order, never trusted from the client.
    const isCod = method === "cod";
    const isPartial = method === "partial_cod";
    const advance = Math.round(total * PARTIAL_COD_ADVANCE_RATE);
    const amount = isPartial ? advance : total;

    const transactionId = isCod ? `COD_${Date.now()}` : `MOCK_${Date.now()}`;

    // COD is collected at delivery, so its payment stays pending.
    const paymentResult = await pool.query(
      `
      INSERT INTO payments
        (order_id, transaction_id, payment_method, payment_status,
         amount, payment_date, failure_reason)
      VALUES ($1, $2, $3, $4, $5, $6, NULL)
      RETURNING *
      `,
      [
        order_id,
        transactionId,
        methodLabel,
        isCod ? "pending" : "paid",
        amount,
        isCod ? null : new Date(),
      ]
    );

    // Only a fully paid online order becomes "paid". COD and Partial COD
    // still have an amount to collect on delivery.
    const orderUpdate = await pool.query(
      `
      UPDATE orders
      SET
        payment_status = $2,
        notes = CASE WHEN $3::text IS NULL THEN notes ELSE $3 END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [
        order_id,
        isCod || isPartial ? "pending" : "paid",
        isCod
          ? `Cash on Delivery: collect Rs ${total} on delivery`
          : isPartial
          ? `Partial COD: Rs ${advance} paid online, collect Rs ${total - advance} on delivery`
          : null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Payment recorded",
      data: {
        payment: paymentResult.rows[0],
        order: orderUpdate.rows[0],
        amount_paid_online: isCod ? 0 : amount,
        amount_due_on_delivery: isCod ? total : isPartial ? total - advance : 0,
      },
    });
  } catch (error: any) {
    console.error("Mock payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record payment",
      error: error.message,
    });
  }
};
