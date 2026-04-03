import bcrypt from "bcrypt";
import { userModel } from "../models/user.model.js";
//The function hashs password
const SALT_ROUNDS = 10;
async function hashPassword(plainText) {
  return await bcrypt.hash(plainText, SALT_ROUNDS);
}
//The function compares a plain password with a hashed password
async function comparePassword(plainText, hashPassword) {
  return await bcrypt.compare(plainText, hashPassword);
}
const validateCreateInput = async (data) => {
  if (!data) {
    throw new Error("Data is required");
  }
  //1. check email
  let { name, email, password, studentId } = data;
  //1.1 check if email is null
  if (!email) {
    throw new Error("Email is required");
  }
  //1.2 check type of email
  if (typeof email !== "string") {
    throw new Error("Email must be a string");
  }
  let lengthEmail = email.length;
  if (email != email.toLowerCase()) {
    throw new Error("Email must be lowercase");
  }

  //1.3 Khong duoc co khoang trang bat ky o dau
  for (let i = 0; i < lengthEmail; i++) {
    if (email[i] === " ") {
      throw new Error("Email must not contain spaces");
    }
  }
  //1.4 check the length of the email

  if (lengthEmail < 8) {
    throw new Error("Email must be at least 8 characters long");
  }

  //1.5 check @
  let t = 0;
  let index; //luu tru vi tri cua @
  for (let i = 0; i < lengthEmail; i++) {
    if (email[i] === "@") {
      t++;
      index = i;
    }
  }
  if (t !== 1) {
    throw new Error("Email must contain exactly one @");
  }
  //1.6 Phần trước va sau @ không được rỗng
  if (index === 0) {
    throw new Error("The part before @ must not be empty");
  }
  if (index === lengthEmail - 1) {
    throw new Error("The part after @ must not be empty");
  }

  //1.7 Phan sau @phai co it nhat mot dau cham
  let check_cham = 0;
  for (let i = index + 1; i < lengthEmail; i++) {
    if (email[i] === ".") check_cham++;
  }
  if (check_cham < 1) {
    throw new Error("The part after @ must contain at least one dot");
  }
  //1.8 Phần trước @ không được bắt đầu hoặc kết thúc bằng dấu .
  if (email[0] === "." || email[index - 1] === ".") {
    throw new Error("The part before @ must not start or end with a dot");
  }
  //1.9 Khong duoc co haidau cham lien tiep
  for (let i = 0; i < lengthEmail - 1; i++) {
    if (email[i] === "." && email[i + 1] === ".") {
      throw new Error("Email must not contain consecutive dots");
    }
  }
  //1.10 Phan sau @ khong duoc bat dau bang dau cham hoac ket thuc bang dau cham
  if (email[index + 1] === "." || email[lengthEmail - 1] === `.`) {
    throw new Error("The part after @ must not start or end with a dot");
  }
  //check if email is existed
  const emailExist = await userModel.findOne({ email: email });
  if (emailExist) {
    throw new Error("Email already exists");
  }
  //2. Check name
  if (!name) {
    throw new Error("Name is required");
  }
  if (typeof name != "string") {
    throw new Error("Name must be a string");
  }
  if (name[0] == " " || name[name.length - 1] == " ") {
    throw new Error("Name must not start or end with a space");
  }
  if (name.length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }
  //3. Check password
  if (!password) {
    throw new Error("Password is required");
  }
  if (typeof password !== "string") {
    throw new Error("Password must be a string");
  }
  let lengthPassword = password.length;
  //3.1 Check lenght of password
  if (lengthPassword < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (lengthPassword > 32) {
    throw new Error("Password must not exceed 32 characters");
  }
  //3.2 Check so chu cai thuong, so, va ky tu dac biet
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
    throw new Error(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    );
  }
  //3.3 check space
  for (let i = 0; i < lengthPassword; i++) {
    if (password[i] === " ") {
      throw new Error("Password must not contain spaces");
    }
  }
  //4 check studentId
  if (studentId) {
    if (typeof studentId !== "string") {
      throw new Error("studentId must be a string");
    }
    if (studentId.includes(" ")) {
      throw new Error("studentId must not contain spaces");
    }
    for (let i = 0; i < studentId.length; i++) {
      if (!(studentId[i] >= "0" && studentId[i] <= "9")) {
        throw new Error("invalid studentId");
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
  });
  const { password: _, ...safeData } = user.toObject();
  return safeData;
};
//1.2 The function create user by admin
export const createUserByAdmin = async (data, role) => {
  await validateCreateInput(data);
  const { name, email, password, studentId, university } = data;
  const hashedPassword = await hashPassword(password);
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    studentId,
    university,
    role: role,
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
  const users = await userModel.find({ name: name }).select("-password");
  return users;
};
//5. update user
export const updateUser = async (data, id) => {
  let updateData = {};
  if (data.name) {
    updateData.name = data.name;
  }
  if (data.email) {
    updateData.email = data.email;
  }
  if (data.password) {
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
    throw new Error("User not found");
  }
  const { password: _, ...safeData } = user.toObject();
  return safeData;
};
export const deleteUser = async (id) => {
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    throw new Error("User not found");
  }
  return { message: `User ${id} was deleted` };
};
