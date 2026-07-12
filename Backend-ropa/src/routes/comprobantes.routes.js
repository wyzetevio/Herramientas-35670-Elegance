import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getComprobanteByOrder } from "../controllers/comprobantes.controller.js";

const router = express.Router();

router.get("/:orderId", verifyToken, getComprobanteByOrder);

export default router;
