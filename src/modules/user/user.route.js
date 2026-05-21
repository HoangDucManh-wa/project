import {
  createUserByAdminController,
  getCurrentUserController,
  getUsersController,
  getUserByIdController,
  getUserByNameController,
  updateUserController,
  updateUserByAdminController,
  deleteUserController,
  lockUserController,
  unlockUserController,
} from "./user.controller.js";
import { verifyToken } from "../../shared/middlewares/auth.middleware.js";
import express from "express";
import { checkRole } from "../../shared/middlewares/authorization.middleware.js";
const router = express.Router();

router.get("/", verifyToken, getUsersController);
router.get("/me", verifyToken, getCurrentUserController);
router.post(
  "/admin/createUser",
  verifyToken,
  checkRole("admin"),
  createUserByAdminController,
);
router.get("/search", verifyToken, getUserByNameController); // đặt trước
router.get("/:id", verifyToken, getUserByIdController);

router.put("/me", verifyToken, updateUserController);
router.put(
  "/admin/:id",
  verifyToken,
  checkRole("admin"),
  updateUserByAdminController,
);
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
router.put("/delete/:id", verifyToken, checkRole("admin"), lockUserController);
export default router;
