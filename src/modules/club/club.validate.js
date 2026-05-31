import { clubModel } from "./club.model.js";
import validator from "validator";
import {
  validateStringField,
  validateStringLength,
  validateObjectId,
  validateEnumField,
  validateIntegerField,
} from "../../shared/services/validate.service.js";
import { UserModel } from "../user/user.model.js";
import AppError from "../../shared/utils/AppError.js";
export const validateClubName = async (clubName, id = null) => {
  validateStringField("clubName", clubName, true);
  validateStringLength("clubName", clubName, 1, 100);
  let club;
  if (id === null) {
    //case 1: create a new club
    club = await clubModel.findOne({ clubName });
  } else {
    //case 2: upgrade the club
    validateObjectId(id);
    club = await clubModel.findOne({
      clubName,
      _id: { $ne: id },
    });
  }
  if (club) {
    throw new AppError("clubName already existed", 400);
  }
};
export const validateDescription = (description) => {
  let result = validateStringField("description", description, false);
  if (result === 0) return;
  validateStringLength("description", description, 0, 5000);
};
export const validateClubCategory = (category) => {
  validateEnumField(
    "Category",
    category,
    ["academic", "sports", "volunteer", "other"],
    true,
  );
};
export const validateClubLeaderId = async (leaderId) => {
  validateObjectId(leaderId);
  const user = await UserModel.findById(leaderId);
  if (!user || user.status !== "active") {
    throw new AppError("Leader not found", 404);
  }
};
export const validateUniversity = (university) => {
  let result = validateStringField("university", university, false);
  if (result === 0) return;
  validateStringLength("university", university, 0, 300);
};
export const validateSocialLinks = (socialLinks) => {
  if (socialLinks === undefined || socialLinks === null) return;
  if (
    !(
      typeof socialLinks === "object" &&
      socialLinks !== null &&
      !Array.isArray(socialLinks)
    )
  ) {
    throw new AppError("The typeof socialLinks is invalid", 400);
  }
  let socialFields = ["facebook", "website"];
  validateEnumField("socialLinks", socialLinks, socialFields, false);
  for (let x of socialFields) {
    let data = socialLinks[x];
    let result = validateStringField("socialLinks", data, false);
    if (result === 0) continue;
    validateStringLength("socialLinks", data, 0, 800);
    if (data && !validator.isURL(data)) {
      throw new AppError(`Invalid ${x} url`, 400);
    }
  }
};
export const validateStats = (stats) => {
  if (stats === undefined || stats === null) return;
  if (!(typeof stats === "object" && stats !== null && !Array.isArray(stats))) {
    throw new AppError("The type of stats is invalid", 400);
  }
  let result = validateEnumField(
    "Stats",
    stats,
    ["posts", "maxMemberCount", "memberCount"],
    false,
  );
  if (result === 0) return;
  let keys = Object.keys(stats);
  let max = 100;
  let maxMemberCount = 150;
  for (let x of keys) {
    if (x === "posts") {
      max = 200;
    } else if (x === "maxMemberCount") {
      max = 150;
    } else {
      max = stats.maxMemberCount ?? maxMemberCount;
    }
    validateIntegerField(x, stats[x], 0, max);
  }
};
export const validateClubStatus = (status) => {
  validateEnumField("status", status, ["active", "inactive"], false);
};
