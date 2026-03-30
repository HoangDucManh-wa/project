import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt.js";

export function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token is missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
      error: err.message,
    });
  }
}
