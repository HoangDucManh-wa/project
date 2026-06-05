import { Membership } from "./membership.model.js";
import AppError from "../../shared/utils/AppError.js";
import { getClubById, updateClub } from "../club/club.service.js";
import {
  validateUser,
  validateClub,
  validateRoleInClub,
} from "./membership.validate.js";
import { validateObjectId } from "../../shared/services/validate.service.js";
export const joinClubService = async ({ userId, clubId }) => {
  const existingMembership = await Membership.findOne({
    user: userId,
    club: clubId,
  });

  if (existingMembership) {
    throw new AppError("You already joined this club", 400);
  }
  await validateUser(userId);
  const club = await getClubById(clubId);
  if (!club) {
    throw new AppError("club not found", 404);
  }
  let { memberCount, maxMemberCount } = club.stats;
  if (memberCount >= maxMemberCount) {
    throw new AppError(
      "The total number of club members has reached its maximum ",
      400,
    );
  }
  await updateClub({
    data: {
      stats: {
        memberCount: memberCount + 1,
      },
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
    throw new AppError("User haven't joined the club", 404);
  }
  const club = await getClubById(clubId);
  let { memberCount } = club.stats;
  memberCount--;
  await updateClub({
    data: {
      stats: {
        memberCount,
      },
    },
    id: clubId,
  });

  return membership;
};

export const getClubMembersService = async ({
  clubId,
  page = 1,
  limit = 30,
}) => {
  let skip = (page - 1) * limit;
  const memberships = await Membership.find({
    club: clubId,
  })
    .populate("user", "name studentId university ")
    .skip(skip)
    .limit(limit);
  if (!memberships) {
    throw new AppError(
      "The club doesn't contain members or the club not found",
      400,
    );
  }
  const members = memberships.map((x) => x.user);
  return members;
};

export const getUserClubsService = async ({ userId, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const memberships = await Membership.find({
    user: userId,
  })
    .populate("club")
    .skip(skip)
    .limit(limit);
  if (!memberships) {
    throw new AppError("User not found in clubs", 404);
  }
  const clubs = memberships.map((x) => x.club);
  return clubs;
};
export const updateMemberRoleByAdminService = async ({
  clubId,
  memberId,
  roleInClub,
}) => {
  validateRoleInClub(roleInClub);
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
  if (!membership) {
    throw new AppError("membership not found", 404);
  }
  return membership;
};
export const deleteMemberByAdminService = async (clubId, memberId) => {
  const membership = await Membership.findOneAndDelete({
    club: clubId,
    user: memberId,
  });
  if (!membership) {
    throw new AppError("membership not found", 404);
  }
  return membership;
};
