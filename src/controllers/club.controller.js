import {
  createClub,
  updateClubName,
  updateMember,
  addMember,
  deleteMember,
} from "../services/club.service.js";

export const createClubController = async (req, res) => {
  try {
    const club = await createClub(req.body);

    return res.status(201).json({
      message: "create club successful",
      club,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: "create club failed",
      error: err.message,
    });
  }
};

export const updateClubNameController = async (req, res) => {
  try {
    const { clubName, id } = req.body;

    const club = await updateClubName(clubName, id);

    return res.status(200).json({
      message: "update clubName successful",
      club,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: "update clubName failed",
      error: err.message,
    });
  }
};

export const updateMemberController = async (req, res) => {
  try {
    const { userId, clubId, index, clubRole } = req.body;

    const club = await updateMember(userId, clubId, index, clubRole);

    return res.status(200).json({
      message: "update member successful",
      club,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: "update member failed",
      error: err.message,
    });
  }
};

export const addMemberController = async (req, res) => {
  try {
    const { idUser, idClub, clubRole } = req.body;

    const club = await addMember(idUser, idClub, clubRole);

    return res.status(201).json({
      message: "add member successful",
      club,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: "add member failed",
      error: err.message,
    });
  }
};

export const deleteMemberController = async (req, res) => {
  try {
    const { idUser, idClub } = req.body;

    const club = await deleteMember(idUser, idClub);

    return res.status(200).json({
      message: "delete member successful",
      club,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: "delete member failed",
      error: err.message,
    });
  }
};
