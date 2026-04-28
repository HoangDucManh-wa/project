import {
  createUserByAdmin,
  getUsers,
  getUserById,
  getUserByName,
  updateUser,
  updateUserByAdmin,
  deleteUser,
  lockUser,
} from "../services/user.service.js";

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
    return res.status(err.status || 500).json({
      message: err.message || "create user failed",
    });
  }
};

export const getUsersController = async (req, res) => {
  try {
    const data = req.query;
    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;

    const users = await getUsers(page, limit);
    return res.status(200).json({
      message: "get users successful",
      data: users,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "get users failed",
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
    return res.status(err.status || 500).json({
      message: err.message || "get user by id failed",
    });
  }
};

export const getUserByNameController = async (req, res) => {
  try {
    const data = req.query;
    const name = data.name;
    const page = data.page || 1;
    const limit = data.limit || 20;
    const user = await getUserByName(name, page, limit);
    return res.status(200).json({
      message: "get user by name successful",
      data: user,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "get user by name failed",
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const data = req.body;
    const id = req.user.id; //lấy id của user ở req.user sau khi qua verifyToken
    const user = await updateUser(data, id);

    return res.status(200).json({
      message: "update user successful",
      data: user,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "update user failed",
    });
  }
};

export const updateUserByAdminController = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const user = await updateUserByAdmin(data, id);

    return res.status(200).json({
      message: "update user by admin successful",
      data: user,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "update user by admin failed",
    });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const id = req.params.id;
    const alert = await deleteUser(id);

    return res.status(200).json({
      message: alert.message,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "delete user failed",
    });
  }
};
export const lockUserController = async (req, res) => {
  try {
    const id = req.params.id;
    const alert = await lockUser(id);
    return res.status(200).json({
      message: alert.message,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "lock user failed",
    });
  }
};
