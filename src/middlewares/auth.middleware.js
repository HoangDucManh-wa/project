import { jwtConfig } from "../configs/jwt.js";
import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({
        message: "token is missing",
      });
    }
    if (!auth.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "invalid token format",
      });
    }
    const token = auth.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "invalid token",
      });
    }
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "unauthorized",
      error: err.message,
    });
  }
};
