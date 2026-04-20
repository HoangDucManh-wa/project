import { jwtConfig } from "../configs/jwt.js";
import { createUser } from "./user.service.js";
import { userModel } from "../models/user.model.js";
import { sendEmail } from "./email.service.js";
import { hashPassword } from "./user.service.js";

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

  const { password: _, ...safeUser } = user.toObject();

  return {
    token,
    user: safeUser,
  };
};
const resetToken = (data) => {
  return jwt.sign(data, jwtConfig.secret, { expiresIn: "10m" });
};
export const forgotPassword = async (email) => {
  if (!email) {
    throw new Error("invalid data");
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("error");
  }
  const token = resetToken({ userId: user._id });
  const link = `http://localhost:${process.env.PORT}/student-portal/auth/updatePassword?token=${token}`;
  await sendEmail(
    user.email,
    `Reset password`,
    `
    <h2>Click this link to update your password</h2>
    <a href="${link}">${link}</a>
    `,
  );
};
export const updatePassword = async (token, newPassword) => {
  if (!token) {
    throw new Error("invalid token");
  }
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    const hashedPassword = await hashPassword(newPassword, 10);
    const user = await userModel.findByIdAndUpdate(
      decoded.userId,
      {
        $set: { password: hashedPassword },
      },
      { new: true },
    );
    return user._id;
  } catch (err) {
    throw new Error(err.message);
  }
};
