import express from "express";
import {
  createClubController,
  updateClubController,
  deleteClubController,
  getClubByIdController,
  getClubsByCategoryController,
  getClubsByNameController,
  getClubsController,
} from "../controllers/club.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/authorization.middleware.js";

const clubRouter = express.Router();
clubRouter.get("/", verifyToken, getClubsController);
clubRouter.get("/search/name", verifyToken, getClubsByNameController);
clubRouter.get("/search/category", verifyToken, getClubsByCategoryController);
clubRouter.get("/search/:id", verifyToken, getClubByIdController);
//1. Create club (Admin only)
clubRouter.post("/", verifyToken, checkRole("admin"), createClubController);

//2. Update club (Admin only)
clubRouter.put("/:id", verifyToken, checkRole("admin"), updateClubController);

//3. Delete club permanently (Admin only)
clubRouter.delete(
  "/:id",
  verifyToken,
  checkRole("admin"),
  deleteClubController,
);

export default clubRouter;
