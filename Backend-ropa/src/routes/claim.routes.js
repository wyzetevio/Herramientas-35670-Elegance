import { Router } from "express";
import { createClaim } from "../controllers/claim.controller.js";

const router = Router();

router.post("/", createClaim);

export default router;