import express from "express";

import {
  googleLogin,
  getMe,
  login,
  staffLogin,
  getStaffMe,
} from "../controllers/authController";

import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.post("/google", googleLogin);

router.post("/login", login);

router.post("/staff-login", staffLogin);

router.get("/me", requireAuth, getMe);

router.get("/staff-me", requireAuth, getStaffMe);

export default router;