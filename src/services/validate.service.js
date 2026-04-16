import { userModel } from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { clubModel } from "../models/club.model.js";
import validator from "validator";
export const validateEmail = async (email) => {
  if (!validator.isEmail(email)) {
    throw new AppError("Invalid email", 400);
  }
  const user = await userModel.findOne({ email });
  if (user) {
    throw new AppError("Email already existed", 409);
  }
};
export const validatePassword = (password) => {
  if (!password) {
    throw new AppError("Password is required", 400);
  }
  if (typeof password !== "string") {
    throw new AppError("Password must be a string", 400);
  }
  let lengthPassword = password.length;
  //3.1 Check lenght of password
  if (lengthPassword < 8) {
    throw new AppError("Password must be at least 8 characters long", 400);
  }
  if (lengthPassword > 32) {
    throw new AppError("Password must not exceed 32 characters", 400);
  }
  //3.2 Check so chu cai thuong,in hoa, so, va ky tu dac biet
  let a = 0,
    b = 0,
    c = 0,
    d = 0;
  for (let i = 0; i < lengthPassword; i++) {
    if (password[i] >= "a" && password[i] <= "z") {
      a++;
    } else if (password[i] >= "0" && password[i] <= "9") {
      b++;
    } else if (password[i] >= "A" && password[i] <= "Z") {
      c++;
    } else {
      d++;
    }
  }
  if (!(a && b && c && d)) {
    throw new AppError(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      400,
    );
  }
  //3.3 check space
  for (let i = 0; i < lengthPassword; i++) {
    if (password[i] === " ") {
      throw new AppError("Password must not contain spaces", 400);
    }
  }
};
export const validateStudentId = (studentId) => {
  if (!studentId) {
    throw new AppError("invalid studentId", 400);
  }
  if (typeof studentId !== "string") {
    throw new AppError("studentId must be a string", 400);
  }
  if (studentId.includes(" ")) {
    throw new AppError("studentId must not contain spaces", 400);
  }
  for (let i = 0; i < studentId.length; i++) {
    if (!(studentId[i] >= "0" && studentId[i] <= "9")) {
      throw new AppError("invalid studentId", 400);
    }
  }
};
export const validateUserName = (name) => {
  if (!name) {
    throw new AppError("Name is required", 400);
  }

  if (typeof name !== "string") {
    throw new AppError("Name must be a string", 400);
  }

  if (name.trim().length !== name.length) {
    throw new AppError("Name must not start or end with a space", 400);
  }

  if (name.length < 2) {
    throw new AppError("Name must be at least 2 characters long", 400);
  }
  if (name.length > 40) {
    throw new AppError("Name must be at max 40 characters long", 400);
  }
};
export const validateUserRole = (role) => {
  if (!role) {
    throw new AppError("invalid role", 400);
  }
  if (role !== "student" && role !== "admin") {
    throw new AppError("Role must be student or admin", 400);
  }
};
