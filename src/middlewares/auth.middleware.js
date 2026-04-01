import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt.js";
export const verifyToken = (req, res, next) => {
  const dataAuthorization = req.headers.authorization;
  if (!dataAuthorization) {
    return res.status(401).json({
      message: "missing authorization",
    });
  }
  if (!dataAuthorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "invalid authorization",
    });
  }
  const token = dataAuthorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "missing token",
    });
  }
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "invalid token",
    });
  }
};
