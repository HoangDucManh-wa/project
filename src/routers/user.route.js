import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  getUserByNameController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller.js";

import express from "express";
const router = express.Router();

router.get("/", getAllUsersController);
router.post("/", createUserController);

router.get("/search", getUserByNameController); // đặt trước
router.get("/:id", getUserByIdController);

router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;
