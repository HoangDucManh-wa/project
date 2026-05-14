import {
  joinClubService,
  leaveClubService,
  getClubMembersService,
  getUserClubsService,
  updateMemberRoleByAdminService,
  deleteMemberByAdminService,
} from "../services/membership.service.js";

//1. Join club
export const joinClubController = async (req, res) => {
  try {
    const userId = req.user._id;
    const clubId = req.params.clubId;

    const membership = await joinClubService({
      userId,
      clubId,
    });

    return res.status(201).json({
      message: "join club successful",
      data: membership,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "join club failed",
    });
  }
};

//2. Leave club
export const leaveClubController = async (req, res) => {
  try {
    const userId = req.user._id;
    const clubId = req.params.clubId;

    const membership = await leaveClubService(userId, clubId);

    return res.status(200).json({
      message: "leave club successful",
      data: membership,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "leave club failed",
    });
  }
};

//3. Get club members
export const getClubMembersController = async (req, res) => {
  try {
    const clubId = req.params.clubId;

    const members = await getClubMembersService(clubId);

    return res.status(200).json({
      message: "get club members successful",
      data: members,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "get club members failed",
    });
  }
};

//4. Get user clubs
export const getUserClubsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const clubs = await getUserClubsService(userId);

    return res.status(200).json({
      message: "get user clubs successful",
      data: clubs,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "get user clubs failed",
    });
  }
};

//5. Update member role by admin
export const updateMemberRoleByAdminController = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const memberId = req.params.memberId;
    const { roleInClub } = req.body;

    const membership = await updateMemberRoleByAdminService({
      clubId,
      memberId,
      roleInClub,
    });

    return res.status(200).json({
      message: "update member role successful",
      data: membership,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "update member role failed",
    });
  }
};

//6. Delete member by admin
export const deleteMemberByAdminController = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const memberId = req.params.memberId;

    const membership = await deleteMemberByAdminService(clubId, memberId);

    return res.status(200).json({
      message: "delete member successful",
      data: membership,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "delete member failed",
    });
  }
};
