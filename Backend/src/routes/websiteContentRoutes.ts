import { Router } from "express";
import {
  deleteWebsiteContent,
  getPublishedWebsiteContent,
  getWebsiteContentForAdmin,
  saveWebsiteContent,
} from "../controllers/websiteContentController";
import { requirePermission } from "../middleware/staff";

const router = Router();
router.get("/", getPublishedWebsiteContent);
router.get("/admin", requirePermission("website-control"), getWebsiteContentForAdmin);
router.put("/:key", requirePermission("website-control"), saveWebsiteContent);
router.delete("/:key", requirePermission("website-control"), deleteWebsiteContent);

export default router;
