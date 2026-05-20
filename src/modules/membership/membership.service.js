import { Membership } from "./membership.model.js";
import AppError from "../../shared/utils/AppError.js";
import { getClubById, updateClub } from "../club/club.service.js";
export const joinClubService = async ({ userId, clubId }) => {
  const existingMembership = await Membership.findOne({
    user: userId,
    club: clubId,
  });

  if (existingMembership) {
    throw new AppError("You already joined this club", 400);
  }
  const club = await getClubById(clubId);
  let { memberCount, maxMemberCount } = club;
  if (memberCount >= maxMemberCount) {
    throw new AppError(
      "The total number of club members has reached its maximum ",
      400,
    );
  }
  await updateClub({
    data: {
      memberCount: memberCount + 1,
    },
    id: clubId,
  });
  const membership = await Membership.create({
    user: userId,
    club: clubId,
    roleInClub: "member",
  });

  return membership;
};

export const leaveClubService = async (userId, clubId) => {
  const membership = await Membership.findOneAndDelete({
    user: userId,
    club: clubId,
  });
  if (!membership) {
    throw new AppError("Membership not found", 404);
  }
  const club = await getClubById(clubId);
  let { memberCount } = club;
  memberCount--;
  await updateClub({
    data: {
      memberCount,
    },
    id: clubId,
  });

  return membership;
};

export const getClubMembersService = async (clubId) => {
  const memberships = await Membership.find({
    club: clubId,
  }).populate("user", "name studentId avatar");
  const members = memberships.map((x) => x.user);
  return members;
};

export const getUserClubsService = async (userId) => {
  const memberships = await Membership.find({
    user: userId,
  }).populate("club");
  const clubs = memberships.map((x) => x.club);
  return clubs;
};
export const updateMemberRoleByAdminService = async ({
  clubId,
  memberId,
  roleInClub,
}) => {
  const membership = await Membership.findOneAndUpdate(
    {
      club: clubId,
      user: memberId,
    },
    {
      roleInClub,
    },
    {
      new: true,
    },
  ).populate("user", "name studentId");

  return membership;
};
export const deleteMemberByAdminService = async (clubId, memberId) => {
  const membership = await Membership.findOneAndDelete({
    club: clubId,
    user: memberId,
  });

  return membership;
};
