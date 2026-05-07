import { Membership } from "../models/membership.model.js";
import AppError from "../utils/AppError.js";

export const joinClubService = async (userId, clubId) => {
  const existingMembership = await Membership.findOne({
    user: userId,
    club: clubId,
  });

  if (existingMembership) {
    throw new AppError("You already joined this club", 400);
  }

  const membership = await Membership.create({
    user: userId,
    club: clubId,
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

  return membership;
};

export const getClubMembersService = async (clubId) => {
  const members = await Membership.find({
    club: clubId,
  }).populate("user", "name email avatar");

  return members;
};

export const getUserClubsService = async (userId) => {
  const clubs = await Membership.find({
    user: userId,
  }).populate("club");

  return clubs;
};
