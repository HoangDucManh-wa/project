import {
  registerController,
  loginController,
  forgotPasswordController,
  updatePasswordController,
} from "../controllers/auth.controller.js";
import express from "express";
const router = express.Router();
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/resetPassword", forgotPasswordController);
router.post("/updatePassword", updatePasswordController);
export default router;
