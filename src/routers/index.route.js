import clubRoute from "./clubs.route.js";
import express from "express";
const router = express.Router();
router.use("/clubs", clubRoute);
export default router;
