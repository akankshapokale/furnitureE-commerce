import express from "express";

import {
  listReviews,
  createStaffReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";
import { requirePermission } from "../middleware/staff";

const router = express.Router();

// Moderation tools for the dashboard. Reading approved reviews and customers submitting
// one live under /api/products/:id/reviews.
router.get("/", requirePermission("products"), listReviews);
router.post("/", requirePermission("products"), createStaffReview);
router.put("/:id", requirePermission("products"), updateReview);
router.delete("/:id", requirePermission("products"), deleteReview);

export default router;
