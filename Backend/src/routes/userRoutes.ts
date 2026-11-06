import express from "express";

import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateMe,
  deleteUser,
} from "../controllers/userController";
import { requireAuth } from "../middleware/auth";
import { requireAdmin, requirePermission } from "../middleware/staff";

const router = express.Router();

// Logged-in user's own profile (must stay above "/:id")
router.put("/me", requireAuth, updateMe);

// Customer list: admins and employees with the "customers" page
router.get("/", requirePermission("customers"), getUsers);

// Creating, editing and deleting arbitrary users (incl. setting roles) is admin only
router.post("/", requireAdmin, createUser);

router.get("/:id", requireAdmin, getUserById);

router.put("/:id", requireAdmin, updateUser);

router.delete("/:id", requireAdmin, deleteUser);

export default router;
