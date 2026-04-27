import {
  registerController,
  loginController,
  meController,
  forgotPasswordController,
  updatePasswordController,
  logoutController,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import express from "express";
const router = express.Router();

router.get("/me", verifyToken, meController);
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", verifyToken, logoutController);
router.post("/resetPassword", forgotPasswordController);
router.post("/updatePassword", updatePasswordController);
export default router;
