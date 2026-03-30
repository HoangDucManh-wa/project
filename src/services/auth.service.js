import { jwtConfig } from "../configs/jwt.js";
import jwt from "jsonwebtoken";
import { createUser } from "./user.service.js";
import bcrypt from "bcrypt";
import { userModel } from "../models/user.model.js";
//create Token
export function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, jwtConfig.secret, {
    expiresIn: jwtConfig.accessTokenExpiresIn,
  });
}
export async function register(data) {
  const user = await createUser(data);
  const token = generateToken(user);

  return {
    user,
    token,
  };
}
export async function login({ email, password }) {
  if (!email) {
    throw new Error("Email is missing");
  }
  if (!password) {
    throw new Error("Password is missing");
  }
  let user = await userModel.findOne({ email: email });
  if (!user) {
    throw new Error("Email didn't exist");
  }
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    throw new Error("Password is wrong");
  }
  const token = generateToken(user);
  return {
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
}
