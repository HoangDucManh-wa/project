// services/auth.service.js

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtConfig } from "../configs/jwt.js";
import User from "../models/user.model.js"; // chỉnh path nếu khác

// ======================
// 🔐 Generate Token
// ======================
export function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, jwtConfig.secret, {
    expiresIn: jwtConfig.accessTokenExpiresIn,
  });
}

// ======================
// 📝 Register
// ======================
export async function register({ email, password }) {
  // validate cơ bản
  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // check user tồn tại
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // tạo user
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return user;
}

// ======================
// 🔓 Login
// ======================
export async function login({ email, password }) {
  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  // tìm user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  // so sánh password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Wrong password");
  }

  // tạo token
  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
    },
  };
}
