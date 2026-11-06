import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../config/db";

const USER_COLUMNS =
  "id, name, email, phone, role, is_active, avatar_url, pincode, flat, area, landmark, city, state, created_at";

const googleClient = new OAuth2Client();

const signToken = (user: { id: number; role: string }) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ sub: String(user.id), role: user.role }, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  });
};

// POST /api/auth/google  { credential: "<Google ID token>" }
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential || typeof credential !== "string") {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error("GOOGLE_CLIENT_ID is not configured");
    }

    // Verifies signature, expiry, issuer and that the audience is our client ID.
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google account",
      });
    }

    // Never link or create accounts from an unverified email address.
    if (!payload.email_verified) {
      return res.status(401).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const name = payload.name || email.split("@")[0];
    const avatarUrl = payload.picture || null;

    // 1) Returning Google user  2) existing email/password user  3) new user
    let result = await pool.query(
      `UPDATE users
       SET avatar_url = COALESCE($2, avatar_url),
           email = $3
       WHERE google_id = $1
       RETURNING ${USER_COLUMNS}`,
      [googleId, avatarUrl, email]
    );

    if (result.rows.length === 0) {
      result = await pool.query(
        `UPDATE users
         SET google_id = $1,
             avatar_url = COALESCE($3, avatar_url)
         WHERE LOWER(email) = $2 AND google_id IS NULL
         RETURNING ${USER_COLUMNS}`,
        [googleId, email, avatarUrl]
      );
    }

    if (result.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO users (name, email, role, google_id, avatar_url, auth_provider)
         VALUES ($1, $2, 'customer', $3, $4, 'google')
         RETURNING ${USER_COLUMNS}`,
        [name, email, googleId, avatarUrl]
      );
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated",
      });
    }

    res.status(200).json({
      success: true,
      token: signToken(user),
      data: user,
    });
  } catch (error: any) {
    console.error("Google login error:", error);

    // verifyIdToken throws on bad/expired/wrong-audience tokens.
    const isTokenError = /token|audience|signature|expired/i.test(
      error?.message || ""
    );

    res.status(isTokenError ? 401 : 500).json({
      success: false,
      message: isTokenError
        ? "Google sign-in failed. Please try again."
        : "Failed to sign in with Google",
    });
  }
};

// GET /api/auth/me  (requires Bearer token)
export const getMe = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
      [req.user!.id]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({
        success: false,
        message: "Account not found or deactivated",
      });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Get me error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch current user",
    });
  }
};

const STAFF_COLUMNS =
  "id, name, email, phone, role, designation, permissions, is_active, avatar_url, created_at";

// POST /api/auth/staff-login  { identifier: email | phone, password, portal: "admin" | "employee" }
export const staffLogin = async (req: Request, res: Response) => {
  try {
    const { identifier, password, portal } = req.body;

    if (
      typeof identifier !== "string" || !identifier.trim() ||
      typeof password !== "string" || !password ||
      (portal !== "admin" && portal !== "employee")
    ) {
      return res.status(400).json({
        success: false,
        message: "Email or phone, and password are required",
      });
    }

    const value = identifier.trim().toLowerCase();
    const isEmail = value.includes("@");
    const phoneDigits = value.replace(/\D/g, "").slice(-10);

    if (!isEmail && phoneDigits.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email or 10-digit phone number",
      });
    }

    const result = await pool.query(
      `SELECT ${STAFF_COLUMNS}, password_hash
       FROM users
       WHERE role IN ('admin', 'employee')
         AND (
           ($1::boolean AND LOWER(email) = $2)
           OR (NOT $1::boolean AND RIGHT(REGEXP_REPLACE(COALESCE(phone, ''), '\\D', '', 'g'), 10) = $3)
         )
       LIMIT 1`,
      [isEmail, value, phoneDigits]
    );

    const user = result.rows[0];

    // Same message for unknown account and wrong password.
    const passwordMatch =
      !!user?.password_hash &&
      (await bcrypt.compare(password, user.password_hash));

    if (!user || !passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated",
      });
    }

    if (user.role !== portal) {
      return res.status(403).json({
        success: false,
        message:
          user.role === "admin"
            ? "This is an admin account. Please use the Admin login."
            : "This is an employee account. Please use the Employee login.",
      });
    }

    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      token: signToken(user),
      data: safeUser,
    });
  } catch (error) {
    console.error("Staff login error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

// GET /api/auth/staff-me  (requires Bearer token) - current admin/employee with permissions
export const getStaffMe = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT ${STAFF_COLUMNS} FROM users
       WHERE id = $1 AND role IN ('admin', 'employee')`,
      [req.user!.id]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({
        success: false,
        message: "Account not found or deactivated",
      });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Get staff me error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch current user",
    });
  }
};

// POST /api/auth/login
export const login =async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const result = await pool.query(
      `SELECT
        ${USER_COLUMNS},
        password_hash
       FROM users
       WHERE LOWER(email) = $1`,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated",
      });
    }

    if (!user.password_hash) {
      return res.status(401).json({
        success: false,
        message:
          "This account does not have a password. Please continue with Google.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: signToken(user),
      data: safeUser,
    });
  } catch (error: any) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};