import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  getUserByNameController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import express from "express";
const router = express.Router();

router.get("/", getAllUsersController);
router.post("/", verifyToken, createUserController);

router.get("/search", verifyToken, getUserByNameController); // đặt trước
router.get("/:id", getUserByIdController);

router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;
