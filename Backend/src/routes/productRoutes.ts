import express from "express";
import { Request, Response } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  getRelatedProducts,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} from "../controllers/productController";
import { getProductReviews, createCustomerReview } from "../controllers/reviewController";
import { requireAuth } from "../middleware/auth";
import { requirePermission } from "../middleware/staff";

const router = express.Router();

// Reading the catalogue is public (the storefront uses it); changing it needs the "products" page.
router.get("/", (req: Request, res: Response) => getProducts(req, res, false));
router.get("/admin", requirePermission("products"), (req: Request, res: Response) => getProducts(req, res, true));
router.get("/admin/:id", requirePermission("products"), (req: Request, res: Response) => getProductById(req, res, true));
router.get("/:id", (req: Request, res: Response) => getProductById(req, res, false));
router.get("/:id/related", getRelatedProducts);
router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", requireAuth, createCustomerReview);
router.post("/", requirePermission("products"), createProduct);
router.put("/:id", requirePermission("products"), updateProduct);
router.patch("/:id/status", requirePermission("products"), updateProductStatus);
router.delete("/:id", requirePermission("products"), deleteProduct);

export default router;
