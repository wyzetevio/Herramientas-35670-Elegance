import { Router } from "express";
import { createClaim } from "../controllers/claim.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/", verifyToken, createClaim);

export default router;
