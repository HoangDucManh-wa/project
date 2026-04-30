import { clubModel } from "../models/club.model.js";
import AppError from "../utils/AppError.js";
import {
  validateClubName,
  validateClubCategory,
  validateClubLeaderId,
  validateMemberCount,
  validateClubStatus,
} from "./validate.service.js";
import mongoose from "mongoose";
async function validateInput(data) {
  if (!data) {
    throw new AppError("invalid data", 400);
  }

  const {
    clubName,
    description,
    category,
    leaderId,
    avatar,
    memberCount,
    status,
  } = data;
  await validateClubName(clubName);
  // validate description (nhẹ, đúng style cũ)
  if (description) {
    if (typeof description !== "string") {
      throw new AppError("description must be string", 400);
    }
  }
  //category
  if (category) {
    validateClubCategory(category);
  }
  //leaderId
  await validateClubLeaderId(leaderId);
  //avatar
  if (avatar) {
    if (typeof avatar !== "string") {
      throw new AppError("Avatar must be string", 400);
    }
  }
  //memberCount
  if (memberCount !== undefined) {
    validateMemberCount(memberCount);
  }
  //status
  if (status) {
    validateClubStatus(status);
  }
}

export const createClub = async (data) => {
  await validateInput(data);

  const {
    clubName,
    description,
    category,
    leaderId,
    avatar,
    memberCount,
    status,
  } = data;

  const club = await clubModel.create({
    clubName,
    description,
    category,
    leaderId,
    avatar,
    memberCount,
    status,
  });

  return club;
};
export const getClubs = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const clubs = await clubModel
    .find({ status: "active" })
    .skip(skip)
    .limit(limit);

  const total = await clubModel.countDocuments({
    status: "active",
  });

  return {
    clubs,
    page,
    limit,
    pageNumber: Math.ceil(total / limit),
    total,
  };
};
export const getClubsByName = async ({ name, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const clubs = await clubModel
    .find({
      clubName: { $regex: name, $options: "i" },
      status: "active",
    })
    .skip(skip)
    .limit(limit);

  const total = await clubModel.countDocuments({
    clubName: { $regex: name, $options: "i" },
    status: "active",
  });

  return {
    clubs,
    page,
    limit,
    pageNumber: Math.ceil(total / limit),
    total,
  };
};
export const getClubsByCategory = async ({
  category,
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;

  const clubs = await clubModel
    .find({
      category,
      status: "active",
    })
    .skip(skip)
    .limit(limit);

  const total = await clubModel.countDocuments({
    category,
    status: "active",
  });

  return {
    clubs,
    page,
    limit,
    pageNumber: Math.ceil(total / limit),
    total,
  };
};
export const getClubById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid clubId format", 400);
  }

  const club = await clubModel.findOne({
    _id: id,
    status: "active",
  });

  if (!club) {
    throw new AppError("Club not found", 404);
  }

  return club;
};
export const updateClub = async ({ data, id }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid clubId format", 400);
  }
  let updateData = {};
  const club = await clubModel.findById(id);
  if (!club) {
    throw new AppError("Club not found", 404);
  }
  // 1. Update clubName
  if (data.clubName) {
    if (data.clubName !== club.clubName) {
      await validateClubName(data.clubName);
      updateData.clubName = data.clubName.trim();
    }
  }

  // 2. Update description
  if (data.description) {
    if (typeof data.description !== "string") {
      throw new AppError("description must be string", 400);
    }
    updateData.description = data.description.trim();
  }

  // 3. Update category
  if (data.category) {
    validateClubCategory(data.category);
    updateData.category = data.category.trim().toLowerCase();
  }

  // 4. Update leaderId
  if (data.leaderId) {
    await validateClubLeaderId(data.leaderId);
    updateData.leaderId = data.leaderId;
  }

  // 5. Update avatar
  if (data.avatar) {
    if (typeof data.avatar !== "string") {
      throw new AppError("avatar must be string", 400);
    }
    updateData.avatar = data.avatar;
  }

  // 6. Update memberCount
  if (data.memberCount !== undefined) {
    validateMemberCount(data.memberCount);
    updateData.memberCount = data.memberCount;
  }

  // 7. Update status
  if (data.status) {
    validateClubStatus(data.status);
    updateData.status = data.status.trim().toLowerCase();
  }

  Object.assign(club, updateData);
  await club.save();
  return club;
};
//xoa vinh vien club
export const deleteClub = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid clubId format", 400);
  }

  const club = await clubModel.findByIdAndDelete(id);

  if (!club) {
    throw new AppError("Club not found", 404);
  }

  return {
    message: `Club ${id} was permanently deleted`,
  };
};
