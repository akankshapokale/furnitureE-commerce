import express from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getMyOrders,
} from "../controllers/orderController";
import { requireAuth } from "../middleware/auth";
import { requireAnyPermission, requirePermission } from "../middleware/staff";

const router = express.Router();

// LOGGED-IN USER'S ORDERS (must stay above "/:id")
router.get("/my", requireAuth, getMyOrders);

// GET ALL ORDERS
router.get("/", requireAnyPermission("orders", "shipments"), getOrders);

// GET ORDER BY ID
router.get("/:id", getOrderById);

// CREATE ORDER
router.post("/", requireAuth, createOrder);

// UPDATE ORDER
router.put("/:id", requirePermission("orders"), updateOrder);

// DELETE ORDER
router.delete("/:id", requirePermission("orders"), deleteOrder);

export default router;
