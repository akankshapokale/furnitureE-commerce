import express from "express";

import {
  getOrderItems,
  getOrderItemsByOrderId,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from "../controllers/orderItemController";
import { requirePermission } from "../middleware/staff";

const router = express.Router();

router.get("/", getOrderItems);
router.get("/order/:orderId", getOrderItemsByOrderId);
router.get("/:id", getOrderItemById);

router.post("/", requirePermission("orders"), createOrderItem);
router.put("/:id", requirePermission("orders"), updateOrderItem);
router.delete("/:id", requirePermission("orders"), deleteOrderItem);

export default router;
