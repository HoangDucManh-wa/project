import {
  createUserController,
  createUserByAdminController,
  getAllUsersController,
  getUserByIdController,
  getUserByNameController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import express from "express";
import { checkRole } from "../middlewares/authorization.middleware.js";
const router = express.Router();

router.get("/", verifyToken, getAllUsersController);
router.post("/createUser", createUserController);
router.post(
  "/admin/createUser",
  verifyToken,
  checkRole("admin"),
  createUserByAdminController,
);
router.get("/search", verifyToken, getUserByNameController); // đặt trước
router.get("/:id", getUserByIdController);

router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;
