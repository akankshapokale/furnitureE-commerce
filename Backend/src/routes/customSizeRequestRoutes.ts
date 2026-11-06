import express from "express";
import {
  createCustomSizeRequest,
  decideCustomSizeQuotation,
  getCustomSizeRequestById,
  getCustomSizeRequests,
  getMyCustomSizeRequests,
  reviewCustomSizeRequest,
  sendCustomSizeQuotation,
  updateCustomSizeRequest,
} from "../controllers/customSizeRequestController";
import { requireAuth } from "../middleware/auth";
import { requirePermission } from "../middleware/staff";

const router = express.Router();

// Customer endpoints
router.get("/my", requireAuth, getMyCustomSizeRequests);
// Keep the fixed admin path before /:id so "admin" is not parsed as a request ID.
router.get("/admin", requirePermission("orders"), getCustomSizeRequests);
router.post("/:id/decision", requireAuth, decideCustomSizeQuotation);
router.get("/:id", requireAuth, getCustomSizeRequestById);
router.post("/", requireAuth, createCustomSizeRequest);

// Admin endpoints (guarded by permission: orders)
router.post("/admin/:id/review", requirePermission("orders"), reviewCustomSizeRequest);
router.post("/admin/:id/quote", requirePermission("orders"), sendCustomSizeQuotation);
router.patch("/admin/:id", requirePermission("orders"), updateCustomSizeRequest);

export default router;
