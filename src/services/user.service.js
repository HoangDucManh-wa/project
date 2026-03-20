import bcrypt from "bcrypt";
import { User } from "../models/user.model"; // Sequelize / Mongoose tuỳ stack

// ─────────────────────────────────────────────
//  Helpers nội bộ
// ─────────────────────────────────────────────
const SALT_ROUNDS = 10;

async function hashPassword(plainText) {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

async function comparePassword(plainText, hashed) {
  return bcrypt.compare(plainText, hashed);
}

// ─────────────────────────────────────────────
//  Service functions
// ─────────────────────────────────────────────

/**
 * Tạo user mới
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<object>} user vừa tạo (không có passwordHash)
 */
async function createUser(data) {
  const { name, email, password } = data;

  // 1. Kiểm tra email đã tồn tại chưa
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const err = new Error("Email đã được sử dụng");
    err.statusCode = 409;
    throw err;
  }

  // 2. Hash password — KHÔNG bao giờ lưu plain text
  const passwordHash = await hashPassword(password);

  // 3. Lưu vào DB
  const user = await User.create({ name, email, passwordHash });

  // 4. Trả về object sạch — loại bỏ passwordHash
  const { passwordHash: _, ...safeUser } = user.toJSON();
  return safeUser;
}

/**
 * Lấy user theo ID
 * @param {string|number} id
 */
async function getUserById(id) {
  const user = await User.findByPk(id);
  if (!user) {
    const err = new Error("Không tìm thấy user");
    err.statusCode = 404;
    throw err;
  }
  const { passwordHash: _, ...safeUser } = user.toJSON();
  return safeUser;
}

/**
 * Lấy danh sách user (có phân trang)
 * @param {{ page?: number, limit?: number }} options
 */
async function getAllUsers({ page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;

  const { count, rows } = await User.findAndCountAll({
    attributes: { exclude: ["passwordHash"] },
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    data: rows.map((u) => u.toJSON()),
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
}

/**
 * Cập nhật thông tin user
 * @param {string|number} id
 * @param {{ name?: string, email?: string }} updates
 */
async function updateUser(id, updates) {
  const user = await User.findByPk(id);
  if (!user) {
    const err = new Error("Không tìm thấy user");
    err.statusCode = 404;
    throw err;
  }

  // Nếu đổi email → check trùng
  if (updates.email && updates.email !== user.email) {
    const existing = await User.findOne({ where: { email: updates.email } });
    if (existing) {
      const err = new Error("Email đã được sử dụng");
      err.statusCode = 409;
      throw err;
    }
  }

  await user.update(updates);

  const { passwordHash: _, ...safeUser } = user.toJSON();
  return safeUser;
}

/**
 * Xoá user theo ID
 * @param {string|number} id
 */
async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    const err = new Error("Không tìm thấy user");
    err.statusCode = 404;
    throw err;
  }

  await user.destroy();
  return { message: `User ${id} đã bị xoá` };
}

/**
 * Đổi mật khẩu
 * @param {string|number} id
 * @param {{ oldPassword: string, newPassword: string }} passwords
 */
async function changePassword(id, { oldPassword, newPassword }) {
  const user = await User.findByPk(id);
  if (!user) {
    const err = new Error("Không tìm thấy user");
    err.statusCode = 404;
    throw err;
  }

  // Verify mật khẩu cũ
  const isMatch = await comparePassword(oldPassword, user.passwordHash);
  if (!isMatch) {
    const err = new Error("Mật khẩu cũ không đúng");
    err.statusCode = 401;
    throw err;
  }

  const newHash = await hashPassword(newPassword);
  await user.update({ passwordHash: newHash });

  return { message: "Đổi mật khẩu thành công" };
}

// ─────────────────────────────────────────────
//  Export
// ─────────────────────────────────────────────
export {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  changePassword,
};
