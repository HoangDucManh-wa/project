import {
  createUser,
  getUsers,
  getUserById,
  getUserByName,
  updateUser,
  deleteUser,
  lockUser,
  unlockUser,
} from "./user.service.js";

const getRequestUserId = (req) => req.user?._id?.toString() || req.user?.id;

const sendError = (res, err, fallbackMessage) =>
  res.status(err.status || 500).json({
    message: err.message || fallbackMessage,
  });

export const createUserController = async (req, res) => {
  try {
    const user = await createUser(req.body, req.user.role);

    return res.status(201).json({
      message: "create user successful",
      data: user,
    });
  } catch (err) {
    return sendError(res, err, "create user failed");
  }
};

export const getUsersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const users = await getUsers(page, limit);

    return res.status(200).json({
      message: "get users successful",
      data: users,
    });
  } catch (err) {
    return sendError(res, err, "get users failed");
  }
};

export const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    return res.status(200).json({
      message: "get user by id successful",
      data: user,
    });
  } catch (err) {
    return sendError(res, err, "get user by id failed");
  }
};

export const getCurrentUserController = async (req, res) => {
  try {
    const user = await getUserById(getRequestUserId(req));

    return res.status(200).json({
      message: "get current user successful",
      data: user,
    });
  } catch (err) {
    return sendError(res, err, "get current user failed");
  }
};

export const getUserByNameController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const users = await getUserByName(req.query.name, page, limit);

    return res.status(200).json({
      message: "get user by name successful",
      data: users,
    });
  } catch (err) {
    return sendError(res, err, "get user by name failed");
  }
};

export const updateUserController = async (req, res) => {
  try {
    const currentUserId = getRequestUserId(req);
    const id = req.params.id || currentUserId;

    if (req.user.role !== "admin" && id !== currentUserId) {
      return res.status(403).json({
        message: "You don't have this permission",
      });
    }

    const user = await updateUser(req.body, id, req.user.role);

    return res.status(200).json({
      message: "update user successful",
      data: user,
    });
  } catch (err) {
    return sendError(res, err, "update user failed");
  }
};
export const deleteUserController = async (req, res) => {
  try {
    const alert = await deleteUser(req.params.id);

    return res.status(200).json({
      message: alert.message,
    });
  } catch (err) {
    return sendError(res, err, "delete user failed");
  }
};

export const lockUserController = async (req, res) => {
  try {
    const alert = await lockUser(req.params.id);

    return res.status(200).json({
      message: alert.message,
    });
  } catch (err) {
    return sendError(res, err, "lock user failed");
  }
};

export const unlockUserController = async (req, res) => {
  try {
    const alert = await unlockUser(req.params.id);

    return res.status(200).json({
      message: alert.message,
    });
  } catch (err) {
    return sendError(res, err, "unlock user failed");
  }
};
