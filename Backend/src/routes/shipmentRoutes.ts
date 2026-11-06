import express from "express";

import {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
} from "../controllers/shipmentController";
import { requireAnyPermission } from "../middleware/staff";

const router = express.Router();

const canManageShipments = requireAnyPermission("orders", "shipments");

router.use(canManageShipments);
router.get("/", getShipments);
router.get("/:id", getShipmentById);
router.post("/", createShipment);
router.put("/:id", updateShipment);
router.delete("/:id", deleteShipment);

export default router;
