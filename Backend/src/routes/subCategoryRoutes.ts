import express from "express";
import { Request, Response } from "express";

import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategoryController";

import { requirePermission } from "../middleware/staff";

const router = express.Router();

router.get("/admin", requirePermission("products"), (req: Request, res: Response) => getSubCategories(req, res, true));
router.get("/", (req: Request, res: Response) => getSubCategories(req, res, false));
router.get("/admin/:id", requirePermission("products"), (req: Request, res: Response) => getSubCategoryById(req, res, true));
router.get("/:id", (req: Request, res: Response) => getSubCategoryById(req, res, false));
router.post("/", requirePermission("products"), createSubCategory);
router.put("/:id", requirePermission("products"), updateSubCategory);
router.delete("/:id", requirePermission("products"), deleteSubCategory);

export default router;
