import bcrypt from "bcrypt";
import { userModel } from "../models/user.model.js";
import {
  validateEmail,
  validatePassword,
  validateStudentId,
  validateUserName,
  validateUserRole,
} from "./validate.service.js";
import AppError from "../utils/AppError.js";
//The function hashs password
const SALT_ROUNDS = 10;
export async function hashPassword(plainText) {
  return await bcrypt.hash(plainText, SALT_ROUNDS);
}
//validate input before creating a user
const validateCreateInput = async (data) => {
  if (!data) {
    throw new AppError("Data is required", 400);
  }
  let { name, email, password, university, studentId, avatar } = data;
  //1. check email
  await validateEmail(email);
  //2. Check name
  validateUserName(name);
  //3. Check password
  validatePassword(password);
  //4 check studentId
  if (studentId) {
    validateStudentId(studentId);
  }
  //5 check avatar
  if (avatar) {
    if (typeof avatar !== "string") {
      throw new AppError("The type of avatar must be string", 400);
    }
  }
  //6 check university
  if (university) {
    if (typeof university !== "string") {
      throw new AppError("university must be string", 400);
    }
  }
};
//1.The function creates users
export const createUser = async (data) => {
  await validateCreateInput(data);
  const { name, email, password, studentId, university, avatar, role } = data;
  if (role !== "student" && role !== "teacher") {
    role = "student";
  }
  const hashedPassword = await hashPassword(password);
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    studentId,
    university,
    role,
    status: "active",
    avatar,
  });
  const { password: _, ...safeData } = user.toObject();
  return safeData;
};
//1.2 The function create user by admin
export const createUserByAdmin = async (data, role) => {
  await validateCreateInput(data);
  validateUserRole(role);
  const { name, email, password, studentId, university, avatar } = data;
  const hashedPassword = await hashPassword(password);
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    studentId,
    university,
    role: role,
    status: "active",
    avatar,
  });
  const { password: _, ...safeData } = user.toObject();
  return safeData;
};
//2. get a number of users
export const getUsers = async (page = 1, limit = 10) => {
  let skip = (page - 1) * limit;
  const users = await userModel
    .find({ status: "active" })
    .select("-password")
    .skip(skip)
    .limit(limit);
  const total = await userModel.countDocuments({ status: "active" });
  return {
    users,
    page,
    limit,
    pageNumber: Math.ceil(total / limit),
  };
};
//3 get user by Id
export const getUserById = async (id) => {
  const user = await userModel
    .findOne({ _id: id, status: "active" })
    .select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};
//4 get users by name
export const getUserByName = async (name, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const users = await userModel
    .find({ name: { $regex: name, $options: "i" }, status: "active" })
    .select("-password")
    .skip(skip)
    .limit(limit);
  return users;
};
//5. update user
export const updateUser = async (data, id) => {
  let updateData = {};
  if (data.name) {
    validateUserName(data.name);
    updateData.name = data.name;
  }
  if (data.email) {
    await validateEmail(data.email);
    updateData.email = data.email;
  }
  if (data.password) {
    validatePassword(data.password);
    updateData.password = await hashPassword(data.password);
  }

  if (data.studentId) {
    validateStudentId(data.studentId);
    updateData.studentId = data.studentId;
  }

  if (data.university) {
    if (typeof data.university !== "string") {
      throw new AppError("university must be string", 400);
    }
    updateData.university = data.university;
  }
  if (data.avatar) {
    if (typeof data.avatar !== "string") {
      throw new AppError("avatar must be string", 400);
    }
    updateData.avatar = data.avatar;
  }
  const user = await userModel.findByIdAndUpdate(
    id,
    {
      $set: updateData,
    },
    { new: true },
  );
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const { password: _, ...safeData } = user.toObject();
  return safeData;
};
export const updateUserByAdmin = async (data, id) => {
  let updateData = {};

  if (data.name) {
    validateUserName(data.name);
    updateData.name = data.name;
  }

  if (data.email) {
    await validateEmail(data.email);
    updateData.email = data.email;
  }

  if (data.password) {
    validatePassword(data.password);
    updateData.password = await hashPassword(data.password);
  }

  if (data.studentId) {
    validateStudentId(data.studentId);
    updateData.studentId = data.studentId;
  }

  if (data.university) {
    if (typeof data.university !== "string") {
      throw new AppError("university must be string");
    }
    updateData.university = data.university;
  }
  if (data.avatar) {
    if (typeof data.avatar !== "string") {
      throw new AppError("avatar must be string", 400);
    }
    updateData.avatar = data.avatar;
  }
  //Only admins can update roles.
  if (data.role) {
    validateUserRole(data.role);
    updateData.role = data.role;
  }
  //Only admins can update status
  if (data.status) {
    if (data.status !== "active" && data.status !== "banned") {
      throw new AppError("status invalid", 400);
    }
    updateData.status = data.status;
  }
  const user = await userModel.findByIdAndUpdate(
    id,
    {
      $set: updateData,
    },
    { new: true },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const { password: _, ...safeData } = user.toObject();
  return safeData;
};
//permanently delete the user
export const deleteUser = async (id) => {
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return { message: `User ${id} was deleted` };
};
//Temporarily lock the user's account.
export const lockUser = async (id) => {
  const user = await userModel.findByIdAndUpdate(
    id,
    {
      $set: { status: "banned" },
    },
    { new: true },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    message: `User ${id} was locked`,
  };
};
