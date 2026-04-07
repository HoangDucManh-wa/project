import {
  createClubController,
  updateClubNameController,
  updateMemberController,
  addMemberController,
  deleteMemberController,
} from "../controllers/club.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/authorization.middleware.js";
import express from "express";

const router = express.Router();

router.post(
  "/admin/createClub",
  verifyToken,
  checkRole("admin"),
  createClubController,
);

router.put(
  "/admin/updateClubName",
  verifyToken,
  checkRole("admin"),
  updateClubNameController,
);

router.put(
  "/admin/updateMember",
  verifyToken,
  checkRole("admin"),
  updateMemberController,
);

router.post(
  "/admin/addMember",
  verifyToken,
  checkRole("admin"),
  addMemberController,
);

router.delete(
  "/admin/deleteMember",
  verifyToken,
  checkRole("admin"),
  deleteMemberController,
);

export default router;
