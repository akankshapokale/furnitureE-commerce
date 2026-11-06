import express from "express";

import {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "../controllers/addressController";
import {
  listMyAddresses,
  createMyAddress,
  setMyDefaultAddress,
  deleteMyAddress,
} from "../controllers/myAddressController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

// Logged-in user's own addresses (must stay above "/:id")
router.get("/mine", requireAuth, listMyAddresses);
router.post("/mine", requireAuth, createMyAddress);
router.patch("/mine/:id/default", requireAuth, setMyDefaultAddress);
router.delete("/mine/:id", requireAuth, deleteMyAddress);

// Get all addresses of user
router.get("/user/:userId", getUserAddresses);

// Get single address
router.get("/:id", getAddressById);

// Create address
router.post("/", createAddress);

// Update address
router.put("/:id", updateAddress);

// Set default address
router.patch("/:id/default", setDefaultAddress);

// Delete address
router.delete("/:id", deleteAddress);

export default router;