import express from "express";
import indexRoute from "./routers/index.route.js";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("welcome!");
});
app.use(indexRoute);
export default app;
