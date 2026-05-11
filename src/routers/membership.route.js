import express from "express";

import {
  joinClubController,
  leaveClubController,
  getClubMembersController,
  getUserClubsController,
  updateMemberRoleByAdminController,
  deleteMemberByAdminController,
} from "../controllers/membership.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/authorization.middleware.js";

const membershipRouter = express.Router();

//1. Join club
membershipRouter.post("/:clubId/join", verifyToken, joinClubController);

//2. Leave club
membershipRouter.delete("/:clubId/leave", verifyToken, leaveClubController);

//3. Get members of club
membershipRouter.get("/:clubId/members", verifyToken, getClubMembersController);

//4. Get current user's clubs
membershipRouter.get("/my-clubs", verifyToken, getUserClubsController);

//5. Update member role (Admin only)
membershipRouter.patch(
  "/:clubId/members/:memberId",
  verifyToken,
  checkRole("admin"),
  updateMemberRoleByAdminController,
);

//6. Delete member from club (Admin only)
membershipRouter.delete(
  "/:clubId/members/:memberId",
  verifyToken,
  checkRole("admin"),
  deleteMemberByAdminController,
);

export default membershipRouter;
