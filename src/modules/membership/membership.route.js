import express from "express";

import {
  joinClubController,
  leaveClubController,
  getClubMembersController,
  getUserClubsController,
  updateMemberRoleByAdminController,
  deleteMemberByAdminController,
} from "./membership.controller.js";

import { verifyToken } from "../../shared/middlewares/auth.middleware.js";
import { checkRole } from "../../shared/middlewares/authorization.middleware.js";

const membershipRouter = express.Router();

//1. Join club
membershipRouter.post("/join/:clubId", verifyToken, joinClubController);

//2. Leave club
membershipRouter.delete("/leave/:clubId", verifyToken, leaveClubController);

//3. Get members of club
membershipRouter.get("/members", verifyToken, getClubMembersController);

//4. Get current user's clubs
membershipRouter.get("/my-clubs", verifyToken, getUserClubsController);

//5. Update member role (Admin only)
membershipRouter.patch(
  "/role/:clubId/:memberId",
  verifyToken,
  checkRole("admin"),
  updateMemberRoleByAdminController,
);

//6. Delete member from club (Admin only)
membershipRouter.delete(
  "/delete/:clubId/:memberId",
  verifyToken,
  checkRole("admin"),
  deleteMemberByAdminController,
);

export default membershipRouter;
