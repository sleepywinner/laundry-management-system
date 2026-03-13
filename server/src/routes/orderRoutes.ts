import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController";
import { protect, adminOnly, staffOnly } from "../middleware/authMiddleware";

const router = express.Router();

// Customer routes
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Staff/Admin routes
router.put("/:id/status", protect, staffOnly, updateOrderStatus);

// Admin only routes
router.get("/", protect, adminOnly, getAllOrders);

export default router;
