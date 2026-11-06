import { Request, Response } from "express";
import { pool } from "../config/db";

// ===============================
// GET ALL ADDRESSES OF A USER
// ===============================
export const getUserAddresses = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        address_type,
        is_default,
        created_at,
        updated_at
      FROM addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at DESC
      `,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({
      message: "Failed to fetch addresses",
    });
  }
};

// ===============================
// GET SINGLE ADDRESS
// ===============================
export const getAddressById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        address_type,
        is_default,
        created_at,
        updated_at
      FROM addresses
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get address error:", error);
    res.status(500).json({
      message: "Failed to fetch address",
    });
  }
};

// ===============================
// CREATE ADDRESS
// ===============================
export const createAddress = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const {
      user_id,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      address_type,
      is_default,
    } = req.body;

    if (
      !user_id ||
      !address_line1 ||
      !city ||
      !state ||
      !postal_code
    ) {
      return res.status(400).json({
        message:
          "user_id, address_line1, city, state and postal_code are required",
      });
    }

    await client.query("BEGIN");

    // If this address is default,
    // remove default from user's other addresses
    if (is_default === true) {
      await client.query(
        `
        UPDATE addresses
        SET is_default = false,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
        `,
        [user_id]
      );
    }

    // If this is user's first address,
    // automatically make it default
    const countResult = await client.query(
      `
      SELECT COUNT(*)::int AS count
      FROM addresses
      WHERE user_id = $1
      `,
      [user_id]
    );

    const isFirstAddress = countResult.rows[0].count === 0;

    const result = await client.query(
      `
      INSERT INTO addresses (
        user_id,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        address_type,
        is_default,
        created_at,
        updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING *
      `,
      [
        user_id,
        address_line1,
        address_line2 || null,
        city,
        state,
        postal_code,
        country || "India",
        address_type || "shipping",
        is_default === true || isFirstAddress,
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Address created successfully",
      address: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Create address error:", error);

    res.status(500).json({
      message: "Failed to create address",
    });
  } finally {
    client.release();
  }
};

// ===============================
// UPDATE ADDRESS
// ===============================
export const updateAddress = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const {
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      address_type,
      is_default,
    } = req.body;

    const existingAddress = await client.query(
      `
      SELECT user_id
      FROM addresses
      WHERE id = $1
      `,
      [id]
    );

    if (existingAddress.rows.length === 0) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const userId = existingAddress.rows[0].user_id;

    await client.query("BEGIN");

    if (is_default === true) {
      await client.query(
        `
        UPDATE addresses
        SET is_default = false,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
          AND id != $2
        `,
        [userId, id]
      );
    }

    const result = await client.query(
      `
      UPDATE addresses
      SET
        address_line1 = $1,
        address_line2 = $2,
        city = $3,
        state = $4,
        postal_code = $5,
        country = $6,
        address_type = $7,
        is_default = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
      `,
      [
        address_line1,
        address_line2 || null,
        city,
        state,
        postal_code,
        country || "India",
        address_type || "shipping",
        is_default === true,
        id,
      ]
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Address updated successfully",
      address: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Update address error:", error);

    res.status(500).json({
      message: "Failed to update address",
    });
  } finally {
    client.release();
  }
};

// ===============================
// SET DEFAULT ADDRESS
// ===============================
export const setDefaultAddress = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const addressResult = await client.query(
      `
      SELECT user_id
      FROM addresses
      WHERE id = $1
      `,
      [id]
    );

    if (addressResult.rows.length === 0) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const userId = addressResult.rows[0].user_id;

    await client.query("BEGIN");

    await client.query(
      `
      UPDATE addresses
      SET is_default = false,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      `,
      [userId]
    );

    const result = await client.query(
      `
      UPDATE addresses
      SET is_default = true,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Default address updated successfully",
      address: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Set default address error:", error);

    res.status(500).json({
      message: "Failed to set default address",
    });
  } finally {
    client.release();
  }
};

// ===============================
// DELETE ADDRESS
// ===============================
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM addresses
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);

    res.status(500).json({
      message: "Failed to delete address",
    });
  }
};