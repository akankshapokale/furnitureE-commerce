import express from "express";
import { Request, Response } from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

import { requirePermission } from "../middleware/staff";

const router = express.Router();

router.get("/admin", requirePermission("products"), (req: Request, res: Response) => getCategories(req, res, true));
router.get("/", (req: Request, res: Response) => getCategories(req, res, false));
router.get("/admin/:id", requirePermission("products"), (req: Request, res: Response) => getCategoryById(req, res, true));
router.get("/:id", (req: Request, res: Response) => getCategoryById(req, res, false));
router.post("/", requirePermission("products"), createCategory);
router.put("/:id", requirePermission("products"), updateCategory);
router.delete("/:id", requirePermission("products"), deleteCategory);

export default router;
