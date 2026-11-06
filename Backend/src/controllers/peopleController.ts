import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/db";
import { sanitizePermissions } from "../config/permissions";

const PEOPLE_COLUMNS =
  "id, name, email, phone, role, designation, department, permissions, is_active, created_at, updated_at";

const MIN_PASSWORD_LENGTH = 8;

const digitsOf = (value: string) => value.replace(/\D/g, "").slice(-10);

// True if another admin/employee already uses this email or phone.
const staffContactTaken = async (
  email: string,
  phone: string | null,
  excludeId?: number
) => {
  const result = await pool.query(
    `SELECT 1 FROM users
     WHERE role IN ('admin', 'employee')
       AND ($3::int IS NULL OR id <> $3)
       AND (
         LOWER(email) = $1
         OR ($2::text IS NOT NULL AND RIGHT(REGEXP_REPLACE(COALESCE(phone, ''), '\\D', '', 'g'), 10) = $2)
       )
     LIMIT 1`,
    [email, phone ? digitsOf(phone) : null, excludeId ?? null]
  );

  return result.rows.length > 0;
};

const cleanText = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

// GET /api/people
export const getPeople = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT ${PEOPLE_COLUMNS} FROM users
       WHERE role = 'employee'
       ORDER BY id DESC`
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Get people error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};

// POST /api/people
export const createPerson = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, designation, department, permissions } = req.body;

    if (!cleanText(name) || !cleanText(email)) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = cleanText(phone);

    if (normalizedPhone && digitsOf(normalizedPhone).length < 10) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit phone number",
      });
    }

    if (await staffContactTaken(normalizedEmail, normalizedPhone)) {
      return res.status(409).json({
        success: false,
        message: "A staff member with this email or phone already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, phone, role, designation, department, permissions, password_hash)
       VALUES ($1, $2, $3, 'employee', $4, $5, $6, $7)
       RETURNING ${PEOPLE_COLUMNS}`,
      [
        name.trim(),
        normalizedEmail,
        normalizedPhone,
        cleanText(designation),
        cleanText(department),
        sanitizePermissions(permissions),
        passwordHash,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Create person error:", error);

    // Unique violation on users.email (e.g. already a customer account).
    if (error?.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create employee",
    });
  }
};

// PUT /api/people/:id  (password is optional: only changes when provided)
export const updatePerson = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email, phone, password, designation, department, permissions, is_active } =
      req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    if (!cleanText(name) || !cleanText(email)) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    if (
      password &&
      (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH)
    ) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = cleanText(phone);

    if (normalizedPhone && digitsOf(normalizedPhone).length < 10) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit phone number",
      });
    }

    if (await staffContactTaken(normalizedEmail, normalizedPhone, id)) {
      return res.status(409).json({
        success: false,
        message: "A staff member with this email or phone already exists",
      });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    // Scoped to role = 'employee' so this can never edit an admin or customer.
    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           phone = $3,
           designation = $4,
           department = $5,
           permissions = $6,
           is_active = $7,
           password_hash = COALESCE($8, password_hash),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND role = 'employee'
       RETURNING ${PEOPLE_COLUMNS}`,
      [
        name.trim(),
        normalizedEmail,
        normalizedPhone,
        cleanText(designation),
        cleanText(department),
        sanitizePermissions(permissions),
        is_active ?? true,
        passwordHash,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Update person error:", error);

    if (error?.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update employee",
    });
  }
};

// DELETE /api/people/:id
export const deletePerson = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 AND role = 'employee' RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete person error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete employee",
    });
  }
};
