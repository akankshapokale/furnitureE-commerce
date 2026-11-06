import express from "express";
import {
  createCustomSizeRequest,
  decideCustomSizeQuotation,
  getCustomSizeRequests,
  getMyCustomSizeRequests,
  updateCustomSizeRequest,
} from "../controllers/customSizeRequestController";
import { requireAuth } from "../middleware/auth";
import { requirePermission } from "../middleware/staff";

const router = express.Router();

router.get("/my", requireAuth, getMyCustomSizeRequests);
router.get("/admin", requirePermission("orders"), getCustomSizeRequests);
router.patch("/admin/:id", requirePermission("orders"), updateCustomSizeRequest);
router.post("/:id/decision", requireAuth, decideCustomSizeQuotation);
router.post("/", requireAuth, createCustomSizeRequest);

export default router;
