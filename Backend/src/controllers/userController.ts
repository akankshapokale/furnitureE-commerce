import { Request, Response } from "express";
import { pool } from "../config/db";
import bcrypt from "bcrypt";

// GET ALL USERS
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        email,
        phone,
        role,
        is_active,
        pincode,
        flat,
        area,
        landmark,
        city,
        state,
        created_at,
        updated_at
       FROM users
       ORDER BY id DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// CREATE USER
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, role, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
        (name, email, phone, role, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING
        id,
        name,
        email,
        phone,
        role,
        is_active,
        pincode,
        flat,
        area,
        landmark,
        city,
        state,
        created_at,
        updated_at`,
      [
        name,
        email,
        phone || null,
        role || "customer",
        passwordHash,
      ]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Create user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

// GET USER BY ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        id,
        name,
        email,
        phone,
        role,
        is_active,
        pincode,
        flat,
        area,
        landmark,
        city,
        state,
        created_at,
        updated_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Get user by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      role,
      is_active,
      pincode,
      flat,
      area,
      landmark,
      city,
      state,
    } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET
        name = $1,
        email = $2,
        phone = $3,
        role = $4,
        is_active = $5,
        pincode = $6,
        flat = $7,
        area = $8,
        landmark = $9,
        city = $10,
        state = $11,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING
        id,
        name,
        email,
        phone,
        role,
        is_active,
        pincode,
        flat,
        area,
        landmark,
        city,
        state,
        created_at,
        updated_at`,
      [
        name,
        email,
        phone || null,
        role || "customer",
        is_active ?? true,
        pincode || null,
        flat || null,
        area || null,
        landmark || null,
        city || null,
        state || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Update user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM users
       WHERE id = $1
       RETURNING id, name, email`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Delete user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// UPDATE LOGGED-IN USER'S OWN PROFILE (PUT /api/users/me)
// Only profile + delivery fields can change (fields not sent are left as-is); role, email and active status cannot.
export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, phone, pincode, flat, area, landmark, city, state } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const result = await pool.query(
      `UPDATE users
       SET
        name = $1,
        phone = CASE WHEN $10::boolean THEN $2 ELSE phone END,
        pincode = COALESCE($3, pincode),
        flat = COALESCE($4, flat),
        area = COALESCE($5, area),
        landmark = COALESCE($6, landmark),
        city = COALESCE($7, city),
        state = COALESCE($8, state),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING
        id, name, email, phone, role, is_active, avatar_url,
        pincode, flat, area, landmark, city, state, created_at`,
      [
        name.trim(),
        phone || null,
        pincode || null,
        flat || null,
        area || null,
        landmark || null,
        city || null,
        state || null,
        userId,
        phone !== undefined,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Seed the first saved address from the delivery details, if none exist yet.
    if (pincode && flat && city && state) {
      await pool.query(
        `INSERT INTO addresses (
           user_id, address_line1, address_line2, city, state,
           postal_code, country, address_type, is_default
         )
         SELECT $1::int, $2::text, $3::text, $4::text, $5::text,
                $6::text, 'India', 'shipping', true
         WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE user_id = $1::int)`,
        [
          userId,
          flat,
          [area, landmark].filter(Boolean).join(", ") || null,
          city,
          state,
          pincode,
        ]
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
