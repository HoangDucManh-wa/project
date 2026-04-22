import express from "express";
import routerUse from "./routers/user.route.js";
import routerAuth from "./routers/auth.route.js";
import routerClub from "./routers/club.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  }),
);
const baseURL = "/api/student-portal";
app.use(express.json());
app.use(cookieParser());

app.use(`${baseURL}/user`, routerUse);
app.use(`${baseURL}/auth`, routerAuth);
app.use(`${baseURL}/club`, routerClub);
export default app;
