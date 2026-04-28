import {
  createClub,
  updateClub,
  deleteClub,
  getClubs,
  getClubById,
  getClubsByCategory,
  getClubsByName,
} from "../services/club.service.js";

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
    return res.status(err.status || 500).json({
      message: err.message || "create club failed",
    });
  }
};
export const getClubsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getClubs(page, limit);

    return res.status(200).json({
      message: "get clubs successful",
      data: result,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "get clubs failed",
    });
  }
};
export const getClubsByNameController = async (req, res) => {
  try {
    const name = req.query.name;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getClubsByName(name, page, limit);

    return res.status(200).json({
      message: "search clubs by name successful",
      data: result,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "search clubs failed",
    });
  }
};
export const getClubsByCategoryController = async (req, res) => {
  try {
    const category = req.query.category;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getClubsByCategory(category, page, limit);

    return res.status(200).json({
      message: "get clubs by category successful",
      data: result,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "get clubs by category failed",
    });
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
    return res.status(err.status || 500).json({
      message: err.message || "get club by id failed",
    });
  }
};
//2. Update club
export const updateClubController = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const club = await updateClub(data, id);

    return res.status(200).json({
      message: "update club successful",
      data: club,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "update club failed",
    });
  }
};

//3. Delete club permanently
export const deleteClubController = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await deleteClub(id);

    return res.status(200).json({
      message: result.message,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "delete club failed",
    });
  }
};
