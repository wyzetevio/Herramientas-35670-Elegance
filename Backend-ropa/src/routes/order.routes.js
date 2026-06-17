import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orders.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyAdmin } from "../middleware/admin.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);

router.get("/", verifyToken, verifyAdmin, getAllOrders);

router.get("/my-orders", verifyToken, getMyOrders);

router.put("/:id/status", verifyToken, verifyAdmin, updateOrderStatus);

export default router;
