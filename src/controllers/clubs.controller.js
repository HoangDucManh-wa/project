import { Club as clubModel } from "../models/clubs.model.js";
export const getClubs = async (req, res) => {
  try {
    const data = await clubModel.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message: "get clubs failed: " + err,
    });
  }
};
export const createClubs = async (req, res) => {
  try {
    const club = await clubModel.create(req.body);
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({
      message: "create new club failed: " + err,
    });
  }
};
