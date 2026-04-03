import {
  createUser,
  createUserByAdmin,
  getAllUsers,
  getUserById,
  getUserByName,
  updateUser,
  deleteUser,
} from "../services/user.service.js";
export const createUserController = async (req, res) => {
  try {
    const data = req.body;
    const user = await createUser(data);
    return res.status(201).json({
      message: "create user successful",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "create user failed",
      error: err.message,
    });
  }
};
export const createUserByAdminController = async (req, res) => {
  try {
    const data = req.body;
    const role = data.role;
    const user = await createUserByAdmin(data, role);
    return res.status(201).json({
      message: "create user by admin successful",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "create user failed",
      error: err.message,
    });
  }
};
export const getAllUsersController = async (req, res) => {
  try {
    const data = req.query;
    const page = parseInt(data.page);
    const limit = parseInt(data.limit);
    const users = await getAllUsers(page, limit);
    return res.status(200).json({
      message: "get users successful",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      message: "get users failed",
      error: err.message,
    });
  }
};
export const getUserByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    return res.status(200).json({
      message: "get user by id successful",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "get user by id failed",
      error: err.message,
    });
  }
};
export const getUserByNameController = async (req, res) => {
  try {
    const name = req.query.name;
    const user = await getUserByName(name);
    return res.status(200).json({
      message: "get user by name successful",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "get user by name failed",
      error: err.message,
    });
  }
};
export const updateUserController = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const user = await updateUser(data, id);
    return res.status(200).json({
      message: "update user successful",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "update user failed",
      data: err.message,
    });
  }
};
export const deleteUserController = async (req, res) => {
  try {
    const id = req.params.id;
    const alert = await deleteUser(id);
    return res.status(200).json({
      message: alert,
    });
  } catch (err) {
    return res.status(500).json({
      message: "delete user failed",
      error: err.message,
    });
  }
};
