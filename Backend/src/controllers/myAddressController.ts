import { Request, Response } from "express";
import { pool } from "../config/db";

const ADDRESS_COLUMNS =
  "id, user_id, address_line1, address_line2, city, state, postal_code, country, address_type, is_default, created_at";

// GET /api/addresses/mine
export const listMyAddresses = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT ${ADDRESS_COLUMNS}
       FROM addresses
       WHERE user_id = $1
       ORDER BY is_default DESC, created_at DESC`,
      [req.user!.id]
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("List my addresses error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch addresses" });
  }
};

// POST /api/addresses/mine
export const createMyAddress = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const userId = req.user!.id;
    const {
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      address_type,
      is_default,
    } = req.body;

    if (!address_line1 || !city || !state || !postal_code) {
      return res.status(400).json({
        success: false,
        message: "Address line, city, state and pincode are required",
      });
    }

    await client.query("BEGIN");

    const { rows } = await client.query(
      "SELECT COUNT(*)::int AS count FROM addresses WHERE user_id = $1",
      [userId]
    );
    const makeDefault = is_default === true || rows[0].count === 0;

    if (makeDefault) {
      await client.query(
        "UPDATE addresses SET is_default = false, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1",
        [userId]
      );
    }

    const result = await client.query(
      `INSERT INTO addresses (
         user_id, address_line1, address_line2, city, state,
         postal_code, country, address_type, is_default
       )
       VALUES ($1, $2, $3, $4, $5, $6, 'India', $7, $8)
       RETURNING ${ADDRESS_COLUMNS}`,
      [
        userId,
        address_line1,
        address_line2 || null,
        city,
        state,
        postal_code,
        address_type || "shipping",
        makeDefault,
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create my address error:", error);
    res.status(500).json({ success: false, message: "Failed to save address" });
  } finally {
    client.release();
  }
};

// PATCH /api/addresses/mine/:id/default
export const setMyDefaultAddress = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const userId = req.user!.id;

    await client.query("BEGIN");

    const owned = await client.query(
      "SELECT id FROM addresses WHERE id = $1 AND user_id = $2",
      [req.params.id, userId]
    );

    if (owned.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    await client.query(
      "UPDATE addresses SET is_default = false, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1",
      [userId]
    );
    await client.query(
      "UPDATE addresses SET is_default = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [req.params.id]
    );

    await client.query("COMMIT");

    res.status(200).json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Set default address error:", error);
    res.status(500).json({ success: false, message: "Failed to update address" });
  } finally {
    client.release();
  }
};

// DELETE /api/addresses/mine/:id
export const deleteMyAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      "DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING is_default",
      [req.params.id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    // Keep one default if the default address was removed.
    if (result.rows[0].is_default) {
      await pool.query(
        `UPDATE addresses SET is_default = true, updated_at = CURRENT_TIMESTAMP
         WHERE id = (
           SELECT id FROM addresses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1
         )`,
        [userId]
      );
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    // 23503: address is still referenced by an order
    if (error?.code === "23503") {
      return res.status(409).json({
        success: false,
        message: "This address is used by an existing order and can't be deleted",
      });
    }

    console.error("Delete my address error:", error);
    res.status(500).json({ success: false, message: "Failed to delete address" });
  }
};
