
import { Router } from "express";
import { requirePermission } from "../middleware/staff";
import {
  getWebsiteSettingsForAdmin,
  getWebsiteSettings,
  updateWebsiteSetting,
} from "../controllers/websiteController";
import {
  getHeroBannersForAdmin,
  getHeroBanners,
  addHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
} from "../controllers/websiteController";


const router = Router();

router.get("/", getWebsiteSettings);
router.get("/admin", requirePermission("website-control"), getWebsiteSettingsForAdmin);
router.put("/", requirePermission("website-control"), updateWebsiteSetting);

router.get("/hero-banners", getHeroBanners);
router.get("/hero-banners/admin", requirePermission("website-control"), getHeroBannersForAdmin);
router.post("/hero-banners", requirePermission("website-control"), addHeroBanner);
router.put("/hero-banners/:id", requirePermission("website-control"), updateHeroBanner);
router.delete("/hero-banners/:id", requirePermission("website-control"), deleteHeroBanner);

export default router;
