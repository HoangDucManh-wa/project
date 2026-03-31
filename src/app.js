import express from "express";
import routerUse from "./routers/user.route.js";
import routerAuth from "./routers/auth.route.js";
const app = express();
app.use(express.json());
app.use("/users", routerUse);
app.use("/auth", routerAuth);
export default app;
