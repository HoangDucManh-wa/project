import { UserModel } from "../../modules/user/user.model.js";
import AppError from "../utils/AppError.js";
import { clubModel } from "../../modules/club/club.model.js";
import validator from "validator";
import mongoose from "mongoose";
export const validateStringField = (field, data, required = false) => {
  if (data === null || data === undefined) {
    if (required) {
      throw new AppError(`{field} is required`, 400);
    }
    return;
  }
  if (typeof data !== "string") {
    throw new AppError(`${field} must be string`, 400);
  }
  if (data.trim() === "") {
    if (required) {
      throw new AppError(`{field} is required`, 400);
    }
  }
};
//Only operate correctly if we make sure that data is string
export const validateStringLength = (field, data, min = 0, max = 100) => {
  let length = data.length;
  if (length < min) {
    throw new AppError(`${field} must ne at least ${min} characters long`, 400);
  }
  if (length > max) {
    throw new AppError(`${field} must ne at max ${max} characters long`, 400);
  }
};
export const validateEnumField = (field, arr = [], enumData = []) => {
  if (arr.length === 0) {
    throw new AppError(`invalid ${field}`, 400);
  }
  arr.forEach((x) => {
    if (!enumData.includes(x)) {
      throw new AppError(`${field} only contains ${array.join(", ")}`, 400);
    }
  });
};
export const validateNumberField = (
  field,
  data,
  min = 0,
  max = 100,
  required = false,
) => {
  if (data === undefined || data === null) {
    if (required) {
      throw new AppError(`${field} is required`, 400);
    }

    return;
  }

  if (typeof data !== "number" || Number.isNaN(data)) {
    throw new AppError(`${field} must be a number`, 400);
  }

  if (data < min) {
    throw new AppError(`${field} must be greater than or equal to ${min}`, 400);
  }

  if (data > max) {
    throw new AppError(`${field} must be less than or equal to ${max}`, 400);
  }
};
export const validateIntegerField = (
  field,
  data,
  min = 0,
  max = 100,
  required = false,
) => {
  validateNumberField(field, data, min, max, required);
  if (!Number.isInteger(data)) {
    throw new AppError(`${field} must be interger`, 400);
  }
};
export const validateStringArray = (
  fieldName,
  array,
  minStringLength = 0,
  maxStringLength = 100,
  required = false,
) => {
  if (array === undefined || array === null) {
    if (required) {
      throw new AppError(`${fieldName} is required`, 400);
    }
    return;
  }

  if (!Array.isArray(array)) {
    throw new AppError(`${fieldName} must be an array`, 400);
  }

  for (const item of array) {
    validateStringField(fieldName, item, true);
    validateStringLength(fieldName, item, minLength, maxLength);
  }
};
export const validateClubName = async (clubName) => {
  if (!clubName) {
    throw new AppError("clubName is required", 400);
  }
  if (typeof clubName !== "string") {
    throw new AppError("Type of clubName must be string", 400);
  }
  const club = await clubModel.findOne({ clubName });
  if (club) {
    throw new AppError("clubName already existed", 400);
  }
};
export const validateClubCategory = (category) => {
  //không cần kiểm tra category có phải là null không, bởi trong service chỉ dùng hàm validateCategory khi category khác null
  if (typeof category !== "string") {
    throw new AppError("category must be string", 400);
  }
  if (
    category !== "academic" &&
    category !== "sports" &&
    category !== "volunteer" &&
    category !== "other"
  ) {
    throw new AppError("category invalid", 400);
  }
};
export const validateClubLeaderId = async (leaderId) => {
  if (!leaderId) {
    throw new AppError("leaderId is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(leaderId)) {
    throw new AppError("Invalid leaderId format", 400);
  }

  const user = await UserModel.findById(leaderId);

  if (!user || user.status !== "active") {
    throw new AppError("Leader not found", 404);
  }
};
export const validateMemberCount = (memberCount) => {
  if (!Number.isInteger(memberCount)) {
    throw new AppError("memberCount must be an integer", 400);
  }

  if (memberCount < 0) {
    throw new AppError("memberCount cannot be less than 0", 400);
  }
};
export const validateClubStatus = (status) => {
  if (typeof status !== "string") {
    throw new AppError("status must be string", 400);
  }

  const validStatuses = ["active", "inactive"];

  if (!validStatuses.includes(status)) {
    throw new AppError("status invalid", 400);
  }
};
