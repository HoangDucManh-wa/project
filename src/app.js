import express from "express";
import routerUse from "./routers/user.route.js";
const app = express();
app.use(express.json());
app.use("/users", routerUse);
export default app;
