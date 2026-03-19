import { getClubs, createClubs } from "../controllers/clubs.controller.js";
import express from "express";
import { clubsMiddleware } from "../middlewares/clubs.middleware.js";
const Router = express.Router();
Router.get("/", getClubs);
Router.post("/", clubsMiddleware, createClubs);
export default Router;
