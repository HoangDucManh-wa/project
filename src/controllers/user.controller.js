import {
  createUser,
  createUserByAdmin,
  getAllUsers,
  getUserById,
  getUserByName,
  updateUser,
  updateUserByAdmin,
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
    return res.status(err.status || 500).json({
      message: err.message || "create user failed",
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
    return res.status(err.status || 500).json({
      message: err.message || "create user failed",
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const data = req.query;
    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;

    const users = await getAllUsers(page, limit);
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

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

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
    const name = req.query.name;
    const user = await getUserByName(name);

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
    const id = req.params.id;
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
