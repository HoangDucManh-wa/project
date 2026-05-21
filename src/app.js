import express from "express";
import routerUse from "./modules/user/user.route.js";
import routerAuth from "./modules/auth/auth.route.js";
import routerClub from "./modules/club/club.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import membershipRouter from "./modules/membership/membership.route.js";
const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  }),
);
const baseURL = "/api/student-ecosystem";
app.use(express.json());
app.use(cookieParser());

app.use(`${baseURL}/user`, routerUse);
app.use(`${baseURL}/auth`, routerAuth);
app.use(`${baseURL}/club`, routerClub);
app.use(`${baseURL}/membership`, membershipRouter);
export default app;
