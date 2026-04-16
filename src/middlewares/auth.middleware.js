import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt.js";
import { userModel } from "../models/user.model.js";
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "missing token",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await userModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "user not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "invalid token",
    });
  }
};
