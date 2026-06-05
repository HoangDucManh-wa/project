import { clubModel } from "./club.model.js";
import AppError from "../../shared/utils/AppError.js";
import {
  validateClubName,
  validateDescription,
  validateClubCategory,
  validateClubLeaderId,
  validateUniversity,
  validateSocialLinks,
  validateStats,
  validateClubStatus,
} from "./club.validate.js";
import {
  validateObjectId,
  validateStringField,
  validateStringLength,
} from "../../shared/services/validate.service.js";
const keywords = ["clubName", "description", "university"];
const fields = [
  "clubName",
  "description",
  "category",
  "leaderId",
  "university",
  "socialLinks",
  "stats",
  "status",
];
function normalizeData(data) {
  if (!(typeof data === "object" && data !== null && !Array.isArray(data)))
    return;
  let normalizedData = {};
  let keys = Object.keys(data);
  for (let x of keys) {
    if (typeof data[x] === "string") {
      normalizedData[x] = data[x].trim();
    } else {
      normalizedData[x] = data[x];
    }
  }
  return normalizedData;
}
async function validateInput(data, id = null) {
  //id===null->this function is used to create a Club
  //id!==null->this function is used to update a Club
  if (data === undefined) {
    throw new AppError("data is required", 400);
  }
  if (!(typeof data === "object" && data !== null && !Array.isArray(data))) {
    throw new AppError("The type of data is invalid", 400);
  }
  const keys = Object.keys(data);
  for (let field of keys) {
    if (!fields.includes(field)) {
      throw new AppError(`${field} field does not exist`, 400);
    }
  }
  let {
    clubName,
    description,
    category,
    leaderId,
    university,
    socialLinks,
    stats,
    status,
  } = data;

  if (id === null) {
    validateClubCategory(category);
    await validateClubLeaderId(leaderId);
    await validateClubName(clubName, id);
    validateDescription(description);
    validateUniversity(university);
    validateSocialLinks(socialLinks);
    validateStats(stats);
    validateClubStatus(status);
  } else {
    const club = await clubModel.findOne({
      _id: id,
      status: "active",
    });
    if (!club) {
      throw new AppError("Club not found", 404);
    }
    if (category !== undefined) validateClubCategory(category);
    if (leaderId !== undefined) await validateClubLeaderId(leaderId);
    if (clubName !== undefined) await validateClubName(clubName, id);
    if (description !== undefined) validateDescription(description);
    if (university !== undefined) validateUniversity(university);
    if (socialLinks !== undefined) validateSocialLinks(socialLinks);
    if (stats !== undefined) validateStats(stats);
    if (status !== undefined) validateClubStatus(status);
  }
}

export const createClub = async (data) => {
  let normalizedData = normalizeData(data);
  await validateInput(normalizedData);
  const club = await clubModel.create(normalizedData);
  if (!club) {
    throw new AppError(`Failed to create the club`, 500);
  }
  return club;
};
export const getClubs = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const clubs = await clubModel
    .find({ status: "active" })
    .sort({ createdAt: -1 })
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
export const getClubsByKeyWords = async ({
  field,
  name,
  page = 1,
  limit = 10,
}) => {
  if (!keywords.includes(field)) {
    throw new AppError(`${field} is invalid`, 400);
  }
  if (name === undefined) return;
  validateStringField(field, name, true);
  validateStringLength(field, name, 1, 100);
  const escapedName = name.replace(/[~`!@#$%^&?*(\)<\>\/{}[\]\\]/g, "\\$&");
  const skip = (page - 1) * limit;

  const clubs = await clubModel
    .find({
      [field]: { $regex: escapedName, $options: "i" },
      status: "active",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await clubModel.countDocuments({
    [field]: { $regex: escapedName, $options: "i" },
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
  validateClubCategory(category);
  const skip = (page - 1) * limit;

  const clubs = await clubModel
    .find({
      category,
      status: "active",
    })
    .sort({ createdAt: -1 })
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
  validateObjectId(id);
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
  validateObjectId(id);
  let normalizedData = normalizeData(data);
  await validateInput(normalizedData, id);
  const club = await clubModel.findByIdAndUpdate(id, normalizedData, {
    new: true,
  });
  return club;
};
export const lockClub = async ({ id }) => {
  validateObjectId(id);
  let club = await clubModel.findOne({
    _id: id,
    status: "active",
  });
  if (!club) {
    throw new AppError("Club not found", 404);
  }
  club = await clubModel.findByIdAndUpdate(
    id,
    { status: "inactive" },
    { new: true },
  );
  return club;
};
//unlock club
export const unlockClub = async ({ id }) => {
  let club = await clubModel.findOne({
    _id: id,
    status: "inactive",
  });
  if (!club) {
    throw new AppError("Club not found", 404);
  }
  club.status = "active";
  await club.save();
  return club;
};
//xoa vinh vien club
export const deleteClub = async (id) => {
  validateObjectId(id);

  const club = await clubModel.findByIdAndDelete(id);

  if (!club) {
    throw new AppError("Club not found", 404);
  }

  return club;
};
