import {
  createUserByAdminController,
  getUsersController,
  getUserByIdController,
  getUserByNameController,
  updateUserController,
  updateUserByAdminController,
  deleteUserController,
  lockUserController,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import express from "express";
import { checkRole } from "../middlewares/authorization.middleware.js";
const router = express.Router();

router.get("/", verifyToken, getUsersController);
router.post(
  "/admin/createUser",
  verifyToken,
  checkRole("admin"),
  createUserByAdminController,
);
router.get("/search", verifyToken, getUserByNameController); // đặt trước
router.get("/:id", verifyToken, getUserByIdController);

router.put("/:id", verifyToken, updateUserController);
router.put(
  "/admin/:id",
  verifyToken,
  checkRole("admin"),
  updateUserByAdminController,
);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRole("admin"),
  deleteUserController,
);
router.put("/delete/:id", verifyToken, checkRole("admin"), lockUserController);
export default router;
