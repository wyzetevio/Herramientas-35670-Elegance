import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/users.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyAdmin } from "../middleware/admin.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", verifyToken, getUserProfile);

router.get("/", verifyToken, verifyAdmin, getAllUsers);

router.put("/:id/role", verifyToken, verifyAdmin, updateUserRole);

router.delete("/:id", verifyToken, verifyAdmin, deleteUser);
export default router;