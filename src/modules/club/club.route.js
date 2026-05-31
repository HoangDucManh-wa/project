import express from "express";
import {
  createClubController,
  updateClubController,
  deleteClubController,
  getClubByIdController,
  getClubsByCategoryController,
  getClubsByKeyWordsController,
  getClubsController,
  lockClubController,
} from "./club.controller.js";

import { verifyToken } from "../../shared/middlewares/auth.middleware.js";
import { checkRole } from "../../shared/middlewares/authorization.middleware.js";

const clubRouter = express.Router();
clubRouter.get("/", verifyToken, getClubsController);
clubRouter.get("/search", verifyToken, getClubsByKeyWordsController);
clubRouter.get("/search/category", verifyToken, getClubsByCategoryController);
clubRouter.get("/:id", verifyToken, getClubByIdController);
//1. Create club (Admin only)
clubRouter.post("/", verifyToken, checkRole("admin"), createClubController);

//2. Update club (Admin only)
clubRouter.put("/:id", verifyToken, checkRole("admin"), updateClubController);
clubRouter.put("/lock/:id", verifyToken, checkRole("admin"), lockClubController);

//3. Delete club permanently (Admin only)
clubRouter.delete(
  "/:id",
  verifyToken,
  checkRole("admin"),
  deleteClubController,
);

export default clubRouter;
