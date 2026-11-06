import { Request, Response } from "express";
import { pool } from "../config/db";

const SHIPMENT_STAGES = new Set([
  "order_placed",
  "order_confirmed",
  "processing",
  "packaging",
  "ready_to_ship",
  "in_transit",
  "out_for_delivery",
  "delivered",
]);

const normalizeShipmentStatus = (value: unknown) => {
  const status = String(value || "").trim().toLowerCase().replace(/[ -]+/g, "_");
  const aliases: Record<string, string> = {
    pending: "order_placed",
    placed: "order_placed",
    confirmed: "order_confirmed",
    accepted: "order_confirmed",
    packed: "packaging",
    dispatched: "ready_to_ship",
    shipped: "in_transit",
    out_of_delivery: "out_for_delivery",
  };
  return aliases[status] || status;
};

// CREATE SHIPMENT
export const createShipment = async (req: Request, res: Response) => {
  try {
    const {
      order_id,
      tracking_number,
      courier_name,
      shipment_status,
      shipped_at,
      estimated_delivery,
      delivered_at,
      shipping_address_id,
    } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required",
      });
    }

    // Check whether order exists
    const orderCheck = await pool.query(
      `SELECT id FROM orders WHERE id = $1`,
      [order_id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Order with id ${order_id} does not exist`,
      });
    }

    const result = await pool.query(
      `INSERT INTO shipments
      (
        order_id,
        tracking_number,
        courier_name,
        shipment_status,
        shipped_at,
        estimated_delivery,
        delivered_at,
        shipping_address_id
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        order_id,
        tracking_number,
        courier_name,
        shipment_status,
        shipped_at,
        estimated_delivery,
        delivered_at,
        shipping_address_id,
        created_at,
        updated_at`,
      [
        order_id,
        tracking_number || null,
        courier_name || null,
        normalizeShipmentStatus(shipment_status || "order_placed"),
        shipped_at || null,
        estimated_delivery || null,
        delivered_at || null,
        shipping_address_id || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Create shipment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create shipment",
      error: error.message,
    });
  }
};

// GET ALL SHIPMENTS
export const getShipments = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        order_id,
        tracking_number,
        courier_name,
        shipment_status,
        shipped_at,
        estimated_delivery,
        delivered_at,
        shipping_address_id,
        created_at,
        updated_at
      FROM shipments
      ORDER BY id DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Get shipments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shipments",
      error: error.message,
    });
  }
};

// GET SHIPMENT BY ID
export const getShipmentById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        id,
        order_id,
        tracking_number,
        courier_name,
        shipment_status,
        shipped_at,
        estimated_delivery,
        delivered_at,
        shipping_address_id,
        created_at,
        updated_at
      FROM shipments
      WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Get shipment by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shipment",
      error: error.message,
    });
  }
};

// UPDATE SHIPMENT
export const updateShipment = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      order_id,
      tracking_number,
      courier_name,
      shipment_status,
      shipped_at,
      estimated_delivery,
      delivered_at,
      shipping_address_id,
    } = req.body;

    const normalizedShipmentStatus = shipment_status === undefined
      ? undefined
      : normalizeShipmentStatus(shipment_status);
    if (normalizedShipmentStatus !== undefined && !SHIPMENT_STAGES.has(normalizedShipmentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipment status",
      });
    }

    // Get existing shipment
    const existingShipment = await pool.query(
      `SELECT id, order_id, shipment_status
       FROM shipments
       WHERE id = $1`,
      [id]
    );

    if (existingShipment.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    // If order_id is being changed, check that order exists
    if (order_id !== undefined) {
      const orderCheck = await pool.query(
        `SELECT id FROM orders WHERE id = $1`,
        [order_id]
      );

      if (orderCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Order with id ${order_id} does not exist`,
        });
      }
    }

    // Keep existing order_id when order_id is not provided
    const finalOrderId =
      order_id !== undefined
        ? order_id
        : existingShipment.rows[0].order_id;

    // Update shipment
    const result = await pool.query(
      `UPDATE shipments
       SET
         order_id = COALESCE($1, order_id),
         tracking_number = COALESCE($2, tracking_number),
         courier_name = COALESCE($3, courier_name),
         shipment_status = COALESCE($4, shipment_status),
         shipped_at = COALESCE($5, shipped_at),
         estimated_delivery = COALESCE($6, estimated_delivery),
         delivered_at = COALESCE($7, delivered_at),
         shipping_address_id = COALESCE($8, shipping_address_id),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING
         id,
         order_id,
         tracking_number,
         courier_name,
         shipment_status,
         shipped_at,
         estimated_delivery,
         delivered_at,
         shipping_address_id,
         created_at,
         updated_at`,
      [
        order_id,
        tracking_number,
        courier_name,
        normalizedShipmentStatus,
        shipped_at ?? (normalizedShipmentStatus === "in_transit" ? new Date().toISOString() : undefined),
        estimated_delivery,
        delivered_at ?? (normalizedShipmentStatus === "delivered" ? new Date().toISOString() : undefined),
        shipping_address_id,
        id,
      ]
    );

    const updatedShipment = result.rows[0];

    // Sync shipment status with related order status
    if (normalizedShipmentStatus !== undefined) {
      await pool.query(
        `UPDATE orders
         SET
           status = $1,
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [normalizedShipmentStatus, finalOrderId]
      );
    }

    res.status(200).json({
      success: true,
      message: "Shipment updated successfully",
      data: updatedShipment,
    });
  } catch (error: any) {
    console.error("Update shipment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update shipment",
      error: error.message,
    });
  }
};

// DELETE SHIPMENT
export const deleteShipment = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM shipments
       WHERE id = $1
       RETURNING id, order_id, tracking_number`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipment deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Delete shipment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete shipment",
      error: error.message,
    });
  }
};
