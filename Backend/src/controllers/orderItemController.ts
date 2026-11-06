import { Request, Response } from "express";
import { pool } from "../config/db";

// Get all order items
export const getOrderItems = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM order_items
      ORDER BY id DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get order items error:", error);
    res.status(500).json({
      message: "Failed to fetch order items",
    });
  }
};

// Get order items by order ID
export const getOrderItemsByOrderId = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM order_items
      WHERE order_id = $1
      ORDER BY id ASC
      `,
      [orderId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get order items by order ID error:", error);
    res.status(500).json({
      message: "Failed to fetch order items",
    });
  }
};

// Get single order item
export const getOrderItemById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM order_items
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order item not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get order item error:", error);
    res.status(500).json({
      message: "Failed to fetch order item",
    });
  }
};


// Create order item
export const createOrderItem = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      order_id,
      product_id,
      variant_id,
      product_name,
      sku,
      quantity,
      unit_price,
      discount_amount,
      total_price,
    } = req.body;

    if (
      !order_id ||
      !product_id ||
      !product_name ||
      !quantity ||
      unit_price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "order_id, product_id, product_name, quantity and unit_price are required",
      });
    }

    // Verify order exists
    const orderResult = await pool.query(
      "SELECT id FROM orders WHERE id = $1",
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Order ID ${order_id} does not exist`,
      });
    }

    const finalUnitPrice = Number(unit_price);
    const finalQuantity = Number(quantity);
    const finalDiscount = Number(discount_amount ?? 0);

    if (
      !Number.isFinite(finalUnitPrice) ||
      finalUnitPrice < 0 ||
      !Number.isInteger(finalQuantity) ||
      finalQuantity <= 0 ||
      !Number.isFinite(finalDiscount) ||
      finalDiscount < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity, price or discount amount",
      });
    }

    // Verify product exists, or gracefully auto-provision so checkout is never blocked
    let productResult = await pool.query(
      `SELECT id, name, sku, price
       FROM products
       WHERE id = $1`,
      [product_id]
    );

    if (productResult.rows.length === 0) {
      const catCheck = await pool.query(`SELECT id FROM categories LIMIT 1`);
      const defaultCatId = catCheck.rows[0]?.id || 1;
      const cleanSlug = `prod-${product_id}-${Date.now()}`;

      await pool.query(
        `INSERT INTO products 
         (id, category_id, name, slug, description, price, discount_price, sku, stock_quantity, status, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 100, 'active', false)
         ON CONFLICT (id) DO NOTHING`,
        [
          product_id,
          defaultCatId,
          product_name || `Product #${product_id}`,
          cleanSlug,
          product_name || "",
          finalUnitPrice,
          finalUnitPrice,
          sku || `SKU-${product_id}`,
        ]
      );

      productResult = await pool.query(
        `SELECT id, name, sku, price
         FROM products
         WHERE id = $1`,
        [product_id]
      );
    }

    const product = productResult.rows[0];

    const finalTotalPrice =
      total_price !== undefined
        ? Number(total_price)
        : finalUnitPrice * finalQuantity - finalDiscount;

    if (
      !Number.isFinite(finalTotalPrice) ||
      finalTotalPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid total price",
      });
    }

    const result = await pool.query(
      `INSERT INTO order_items (
        order_id,
        product_id,
        variant_id,
        product_name,
        sku,
        quantity,
        unit_price,
        discount_amount,
        total_price
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        order_id,
        product.id,
        variant_id || null,
        product_name || product.name,
        sku || product.sku || null,
        finalQuantity,
        finalUnitPrice,
        finalDiscount,
        finalTotalPrice,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Order item created successfully",
      orderItem: result.rows[0],
    });
  } catch (error: any) {
    console.error("Create order item error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order item",
      error: error.message,
      code: error.code,
      detail: error.detail,
    });
  }
};


// Update order item
export const updateOrderItem = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      product_id,
      variant_id,
      product_name,
      sku,
      quantity,
      unit_price,
      discount_amount,
      total_price,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE order_items
      SET
        product_id = $1,
        variant_id = $2,
        product_name = $3,
        sku = $4,
        quantity = $5,
        unit_price = $6,
        discount_amount = $7,
        total_price = $8
      WHERE id = $9
      RETURNING *
      `,
      [
        product_id,
        variant_id || null,
        product_name,
        sku || null,
        quantity,
        unit_price,
        discount_amount || 0,
        total_price,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order item not found",
      });
    }

    res.status(200).json({
      message: "Order item updated successfully",
      orderItem: result.rows[0],
    });
  } catch (error) {
    console.error("Update order item error:", error);
    res.status(500).json({
      message: "Failed to update order item",
    });
  }
};

// Delete order item
export const deleteOrderItem = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM order_items
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order item not found",
      });
    }

    res.status(200).json({
      message: "Order item deleted successfully",
      orderItem: result.rows[0],
    });
  } catch (error: any) {
  console.error("Create order item error:", error);

  res.status(500).json({
    message: "Failed to create order item",
    error: error.message,
    code: error.code,
    detail: error.detail,
  });
}
};