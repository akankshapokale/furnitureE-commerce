import { NextFunction, Request, Response } from "express";
import { pool } from "../config/db";
import { requireAuth } from "./auth";

declare global {
  namespace Express {
    interface Request {
      staff?: { id: number; role: "admin" | "employee"; permissions: string[] };
    }
  }
}

// Loads the staff member fresh from the DB on every request so that
// deactivation and permission changes take effect immediately.
const loadStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      `SELECT id, role, is_active, permissions FROM users WHERE id = $1`,
      [req.user!.id]
    );

    const row = result.rows[0];

    if (!row || !row.is_active || !["admin", "employee"].includes(row.role)) {
      return res.status(403).json({
        success: false,
        message: "Staff access required",
      });
    }

    req.staff = {
      id: row.id,
      role: row.role,
      permissions: row.permissions || [],
    };

    next();
  } catch (error) {
    console.error("Staff lookup error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify access",
    });
  }
};

const forbidden = (res: Response) =>
  res.status(403).json({
    success: false,
    message: "You do not have permission to access this",
  });

export const requireAdmin = [
  requireAuth,
  loadStaff,
  (req: Request, res: Response, next: NextFunction) =>
    req.staff!.role === "admin" ? next() : forbidden(res),
];

// Admins pass automatically; employees need the given page key.
export const requirePermission = (key: string) => [
  requireAuth,
  loadStaff,
  (req: Request, res: Response, next: NextFunction) =>
    req.staff!.role === "admin" || req.staff!.permissions.includes(key)
      ? next()
      : forbidden(res),
];

export const requireAnyPermission = (...keys: string[]) => [
  requireAuth,
  loadStaff,
  (req: Request, res: Response, next: NextFunction) =>
    req.staff!.role === "admin" || keys.some((key) => req.staff!.permissions.includes(key))
      ? next()
      : forbidden(res),
];
