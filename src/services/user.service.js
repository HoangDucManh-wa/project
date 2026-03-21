import bcrypt from "bcrypt";
import userModel from "../models/user.model"; // Mongoose model

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const SALT_ROUNDS = 10;

async function hashPassword(plainText) {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

async function comparePassword(plainText, hashed) {
  return bcrypt.compare(plainText, hashed);
}

// ─────────────────────────────────────────────
// Service functions
// ─────────────────────────────────────────────

// ✅ CREATE USER
export const createUser = async (data) => {
  const { name, email, password } = data;

  // 1. Check email tồn tại
  const existing = await userModel.findOne({ email });
  if (existing) {
    const err = new Error("Email đã được sử dụng");
    err.statusCode = 409;
    throw err;
  }

  // 2. Hash password
  const passwordHash = await hashPassword(password);

  // 3. Tạo user
  const user = await userModel.create({
    name,
    email,
    passwordHash,
  });

  // 4. Xoá password trước khi trả
  const { passwordHash: _, ...safeUser } = user.toObject();
  return safeUser;
};

// ✅ GET USER BY ID
export const getUserById = async (id) => {
  const user = await userModel.findById(id);

  if (!user) {
    const err = new Error("Không tìm thấy user");
    err.statusCode = 404;
    throw err;
  }

  const { passwordHash: _, ...safeUser } = user.toObject();
  return safeUser;
};

// ✅ GET ALL USERS (pagination)
export const getAllUsers = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    userModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    userModel.countDocuments(),
  ]);

  return {
    data: users.map((u) => {
      const { passwordHash, ...rest } = u.toObject();
      return rest;
    }),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ✅ UPDATE USER
export const updateUser = async (id, updates) => {
  const user = await userModel.findById(id);

  if (!user) {
    const err = new Error("Không tìm thấy user");
    err.statusCode = 404;
    throw err;
  }

  // Check email trùng
  if (updates.email && updates.email !== user.email) {
    const existing = await userModel.findOne({ email: updates.email });
    if (existing) {
      const err = new Error("Email đã được sử dụng");
      err.statusCode = 409;
      throw err;
    }
  }

  Object.assign(user, updates);
  await user.save();

  const { passwordHash, ...safeUser } = user.toObject();
  return safeUser;
};

// ✅ DELETE USER
export const deleteUser = async (id) => {
  const user = await userModel.findByIdAndDelete(id);

  if (!user) {
    const err = new Error("Không tìm thấy user");
    err.statusCode = 404;
    throw err;
  }

  return { message: `User ${id} đã bị xoá` };
};

// ✅ CHANGE PASSWORD
export const changePassword = async (id, { oldPassword, newPassword }) => {
  const user = await userModel.findById(id);

  if (!user) {
    const err = new Error("Không tìm thấy user");
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await comparePassword(oldPassword, user.passwordHash);
  if (!isMatch) {
    const err = new Error("Mật khẩu cũ không đúng");
    err.statusCode = 401;
    throw err;
  }

  const newHash = await hashPassword(newPassword);
  user.passwordHash = newHash;
  await user.save();

  return { message: "Đổi mật khẩu thành công" };
};
