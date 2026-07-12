import express from "express";

import { verifyToken } from "../middleware/auth.js";
import { verifyAdmin } from "../middleware/admin.js";

import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, getDashboardStats);

export default router;