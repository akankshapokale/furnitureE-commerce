
import { Router } from "express";
import { requirePermission } from "../middleware/staff";
import {
  getOffers,
  createOffer,
  updateOffer,
  updateOfferStatus,
} from "../controllers/offerController";

const router = Router();

router.get("/", getOffers);
router.post("/", requirePermission("website-control"), createOffer);
router.put("/:id", requirePermission("website-control"), updateOffer);
router.patch("/:id/status", requirePermission("website-control"), updateOfferStatus);

export default router;
