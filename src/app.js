import express from "express";
import routerUse from "./routers/user.route.js";
import routerAuth from "./routers/auth.route.js";
import routerClub from "./routers/club.route.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  }),
);
app.use(express.json());

app.use("/student-portal/user", routerUse);
app.use("/student-portal/auth", routerAuth);
app.use("/student-portal/club", routerClub);
export default app;
