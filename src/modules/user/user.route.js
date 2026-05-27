import express from "express";
import {
  createUserController,
  getCurrentUserController,
  getUsersController,
  getUserByIdController,
  getUserByNameController,
  updateUserController,
  deleteUserController,
  lockUserController,
  unlockUserController,
} from "./user.controller.js";
import { verifyToken } from "../../shared/middlewares/auth.middleware.js";
import { checkRole } from "../../shared/middlewares/authorization.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getUsersController);
router.get("/me", verifyToken, getCurrentUserController);
router.get("/search", verifyToken, getUserByNameController);
router.get("/:id", verifyToken, getUserByIdController);

router.post("/createUser", verifyToken, createUserController);

router.put("/me", verifyToken, updateUserController);
router.put("/admin/:id", verifyToken, updateUserController);
router.put("/:id", verifyToken, updateUserController);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRole("admin"),
  deleteUserController,
);
router.put("/lock/:id", verifyToken, checkRole("admin"), lockUserController);
router.put(
  "/unlock/:id",
  verifyToken,
  checkRole("admin"),
  unlockUserController,
);

export default router;
