import {
  createClub,
  updateClub,
  deleteClub,
  getClubs,
  getClubById,
  getClubsByCategory,
  getClubsByKeyWords,
  lockClub,
  unlockClub,
} from "./club.service.js";

const sendError = (res, err, mess) =>
  res.status(err.status || 500).json({
    message: mess || err.message,
    err: err.message,
  });

//1. Create club
export const createClubController = async (req, res) => {
  try {
    const data = req.body;

    const club = await createClub(data);

    return res.status(201).json({
      message: "create club successful",
      data: club,
    });
  } catch (err) {
    return sendError(res, err, "create club failed");
  }
};
export const getClubsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getClubs({ page, limit });

    return res.status(200).json({
      message: "get clubs successful",
      data: result,
    });
  } catch (err) {
    return sendError(res, err, "get clubs failed");
  }
};
export const getClubsByKeyWordsController = async (req, res) => {
  try {
    const field = req.query.field;
    const name = req.query.name;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getClubsByKeyWords({ field, name, page, limit });

    return res.status(200).json({
      message: `search clubs by ${field} successful`,
      data: result,
    });
  } catch (err) {
    return sendError(res, err, "search clubs by keywords failed");
  }
};
export const getClubsByCategoryController = async (req, res) => {
  try {
    const category = req.query.category;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getClubsByCategory({ category, page, limit });

    return res.status(200).json({
      message: "get clubs by category successful",
      data: result,
    });
  } catch (err) {
    return sendError(res, err, "get clubs by category failed");
  }
};
export const getClubByIdController = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await getClubById(id);

    return res.status(200).json({
      message: "get club by id successful",
      data: result,
    });
  } catch (err) {
    return sendError(res, err, "get club by id failed");
  }
};
//2. Update club
export const updateClubController = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const club = await updateClub({ data, id });

    return res.status(200).json({
      message: "update club successful",
      data: club,
    });
  } catch (err) {
    return sendError(res, err, "update club failed");
  }
};

export const lockClubController = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await lockClub({ id });

    return res.status(200).json({
      message: "lock club successful",
      data: result,
    });
  } catch (err) {
    return sendError(res, err, "lock club failed");
  }
};
export const unlockClubController = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await unlockClub({ id });

    return res.status(200).json({
      message: "unlock club successful",
      data: result,
    });
  } catch (err) {
    return sendError(res, err, "unlock club failed");
  }
};
//3. Delete club permanently
export const deleteClubController = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await deleteClub(id);

    return res.status(200).json({
      message: "delete club successful",
      data: result,
    });
  } catch (err) {
    return sendError(res, err, "delete club failed");
  }
};
