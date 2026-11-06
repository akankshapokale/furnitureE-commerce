import express from "express";

import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  verifyPayment,
  createMockPayment,
} from "../controllers/paymentController";

const router = express.Router();

router.get("/", getPayments);
router.get("/:id", getPaymentById);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);
router.post("/verify", verifyPayment);
router.post("/mock", createMockPayment);

export default router;