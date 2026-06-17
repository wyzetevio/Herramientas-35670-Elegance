import express from "express";
import {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartProduct,
  clearCartUser,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/", addCartItem);
router.put("/", updateCartItem);
router.delete("/clear/:userId", clearCartUser);
router.delete("/:userId/:productId", deleteCartProduct);

export default router;
