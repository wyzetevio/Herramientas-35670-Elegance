import express from "express";

import {
  getProducts,
  getProduct,
  createNewProduct,
  updateExistingProduct,
  removeProduct,
} from "../controllers/products.controller.js";

import { verifyToken } from "../middleware/auth.js";
import { verifyAdmin } from "../middleware/admin.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

router.post("/", verifyToken, verifyAdmin, createNewProduct);

router.put("/:id", verifyToken, verifyAdmin, updateExistingProduct);

router.delete("/:id", verifyToken, verifyAdmin, removeProduct);

export default router;