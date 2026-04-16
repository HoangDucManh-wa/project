import bcrypt from "bcrypt";
import { userModel } from "../models/user.model.js";
import { clubModel } from "../models/club.model.js";
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
//The function compares a plain password with a hashed password
async function comparePassword(plainText, hashPassword) {
  return await bcrypt.compare(plainText, hashPassword);
}
const validateCreateInput = async (data) => {
  if (!data) {
    throw new AppError("Data is required", 400);
  }
  let { name, email, password, studentId, clubs } = data;
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
  //5 check clubs
  if (clubs) {
    for (const x of clubs) {
      const club = await clubModel.findById(x);
      if (!club) {
        throw new AppError("invalid club", 400);
      }
    }
  }
};
//1.The function creates users
export const createUser = async (data) => {
  await validateCreateInput(data);
  const { name, email, password, studentId, university } = data;
  const hashedPassword = await hashPassword(password);
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    studentId,
    university,
    role: "student",
    clubs: [],
  });
  const { password: _, ...safeData } = user.toObject();
  return safeData;
};
//1.2 The function create user by admin
export const createUserByAdmin = async (data, role) => {
  await validateCreateInput(data);
  validateUserRole(role);
  const { name, email, password, studentId, university, clubs } = data;
  const hashedPassword = await hashPassword(password);
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    studentId,
    university,
    role: role,
    clubs,
  });
  const { password: _, ...safeData } = user.toObject();
  return safeData;
};
//2. get a number of users
export const getAllUsers = async (page = 1, limit = 10) => {
  let skip = (page - 1) * limit;
  const users = await userModel
    .find()
    .select("-password")
    .skip(skip)
    .limit(limit);
  const total = await userModel.countDocuments();
  return {
    users,
    page,
    limit,
    pageNumber: Math.ceil(total / limit),
  };
};
//3 get user by Id
export const getUserById = async (id) => {
  const user = await userModel.findById(id).select("-password");
  return user;
};
//4 get users by name
export const getUserByName = async (name) => {
  const users = await userModel
    .find({ name: { $regex: name, $options: "i" } })
    .select("-password");
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
    validateEmail(data.email);
    updateData.email = data.email;
  }
  if (data.password) {
    validatePassword(data.password);
    updateData.password = await hashPassword(data.password);
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
export const deleteUser = async (id) => {
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return { message: `User ${id} was deleted` };
};
