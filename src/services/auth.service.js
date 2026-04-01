import { jwtConfig } from "../configs/jwt.js";
import { createUser } from "./user.service.js";
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const createToken = (data) => {
  return jwt.sign(data, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};
export const register = async (data) => {
  const user = await createUser(data);
  const token = createToken({ userId: user._id });
  return {
    user,
    token,
  };
};
export const login = async ({ email, password }) => {
  if (!(email && password)) {
    throw new Error("Missing email or password");
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("User doesn't exist");
  }
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    throw new Error("Password is wrong");
  }
  const token = createToken({ userId: user._id });
  return {
    token,
  };
};
