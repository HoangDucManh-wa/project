import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";
import { UserModel } from "./user.model.js";
import {
  validateEmail,
  validatePassword,
  validateStudentId,
  validateUserName,
  validateUserRole,
} from "../../shared/services/validate.service.js";
import AppError from "../../shared/utils/AppError.js";

const SALT_ROUNDS = 10;

const USER_STATUSES = ["active", "banned"];
const GENDERS = ["male", "female", "other"];
const RELATIONSHIP_STATUSES = ["single", "in_relationship", "married"];
const SOCIAL_LINK_FIELDS = ["github", "linkedin", "portfolio", "facebook"];
const STRING_ARRAY_FIELDS = [
  "careerPaths",
  "techStacks",
  "skills",
  "interests",
];

const publicUserProjection = "-password";

export async function hashPassword(plainText) {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

const toSafeUser = (user) => {
  const userObject = user.toObject ? user.toObject() : user;
  const { password: _, ...safeData } = userObject;
  return safeData;
};

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid user id", 400);
  }
};

const handleDuplicateKeyError = (err) => {
  if (err?.code !== 11000) {
    throw err;
  }

  const fields = Object.keys(err.keyPattern || err.keyValue || {});

  if (fields.includes("email")) {
    throw new AppError("Email already existed", 409);
  }

  if (fields.includes("studentId")) {
    throw new AppError("Student id already existed in this university", 409);
  }

  throw new AppError("User already existed", 409);
};

const validateStringField = (field, value, { required = false } = {}) => {
  if (value === undefined || value === null) {
    if (required) {
      throw new AppError(`${field} is required`, 400);
    }
    return;
  }

  if (typeof value !== "string") {
    throw new AppError(`${field} must be string`, 400);
  }
};

const validateNumberField = (field, value, { min, max } = {}) => {
  if (value === undefined || value === null) {
    return;
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new AppError(`${field} must be number`, 400);
  }

  if (min !== undefined && value < min) {
    throw new AppError(`${field} must be at least ${min}`, 400);
  }

  if (max !== undefined && value > max) {
    throw new AppError(`${field} must be at most ${max}`, 400);
  }
};

const validateEnumField = (field, value, allowedValues) => {
  if (value === undefined || value === null || value === "") {
    return;
  }

  if (!allowedValues.includes(value)) {
    throw new AppError(`${field} invalid`, 400);
  }
};

const validateStringArrayField = (field, value) => {
  if (value === undefined || value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    throw new AppError(`${field} must be an array`, 400);
  }

  const hasInvalidValue = value.some((item) => typeof item !== "string");
  if (hasInvalidValue) {
    throw new AppError(`${field} must contain only strings`, 400);
  }
};

const validateSocialLinks = (socialLinks) => {
  if (socialLinks === undefined || socialLinks === null) {
    return;
  }

  if (typeof socialLinks !== "object" || Array.isArray(socialLinks)) {
    throw new AppError("socialLinks must be object", 400);
  }

  for (const field of SOCIAL_LINK_FIELDS) {
    validateStringField(`socialLinks.${field}`, socialLinks[field]);
  }
};

const validateStudentIdValue = (studentId) => {
  if (studentId === undefined || studentId === null) {
    return;
  }

  validateStudentId(studentId);
};

const validateEmailFormat = (email) => {
  validateStringField("email", email, { required: true });

  if (!validator.isEmail(email)) {
    throw new AppError("Invalid email", 400);
  }
};

const assertEmailAvailableForUpdate = async (email, userId) => {
  if (!email) {
    return;
  }

  const existingUser = await UserModel.findOne({
    email,
    _id: { $ne: userId },
  });

  if (existingUser) {
    throw new AppError("Email already existed", 409);
  }
};

const normalizeCreateData = (data) => ({
  ...data,
  name: typeof data.name === "string" ? data.name.trim() : data.name,
  email:
    typeof data.email === "string"
      ? data.email.trim().toLowerCase()
      : data.email,
  studentId:
    typeof data.studentId === "string" ? data.studentId.trim() : data.studentId,
  university:
    typeof data.university === "string"
      ? data.university.trim()
      : data.university,
  major: typeof data.major === "string" ? data.major.trim() : data.major,
  role:
    typeof data.role === "string" ? data.role.trim().toLowerCase() : data.role,
  status:
    typeof data.status === "string"
      ? data.status.trim().toLowerCase()
      : data.status,
  avatarUrl: data.avatarUrl ?? data.avatar,
});

const validateCreateInput = async (data) => {
  if (!data) {
    throw new AppError("Data is required", 400);
  }

  const normalizedData = normalizeCreateData(data);

  validateUserName(normalizedData.name);
  validateEmailFormat(normalizedData.email);
  await validateEmail(normalizedData.email);
  validatePassword(normalizedData.password);
  validateStudentIdValue(normalizedData.studentId);

  validateStringField("avatarUrl", normalizedData.avatarUrl);
  validateStringField("coverUrl", normalizedData.coverUrl);
  validateStringField("bio", normalizedData.bio);
  validateStringField("university", normalizedData.university);
  validateStringField("major", normalizedData.major);

  validateNumberField("age", normalizedData.age, { min: 0 });
  validateNumberField("academicYear", normalizedData.academicYear, {
    min: 1,
    max: 10,
  });

  validateEnumField("gender", normalizedData.gender, GENDERS);
  validateEnumField(
    "relationshipStatus",
    normalizedData.relationshipStatus,
    RELATIONSHIP_STATUSES,
  );

  for (const field of STRING_ARRAY_FIELDS) {
    validateStringArrayField(field, normalizedData[field]);
  }

  validateSocialLinks(normalizedData.socialLinks);
};

const pickProfileFields = (data) => {
  const normalizedData = normalizeCreateData(data);
  const profileFields = [
    "name",
    "email",
    "password",
    "studentId",
    "avatarUrl",
    "coverUrl",
    "bio",
    "age",
    "gender",
    "relationshipStatus",
    "university",
    "major",
    "academicYear",
    ...STRING_ARRAY_FIELDS,
  ];

  return profileFields.reduce((result, field) => {
    if (normalizedData[field] !== undefined) {
      result[field] = normalizedData[field];
    }

    return result;
  }, {});
};

const buildUpdateData = async (
  data,
  userId,
  { allowAdminFields = false } = {},
) => {
  if (!data) {
    throw new AppError("Data is required", 400);
  }

  const normalizedData = normalizeCreateData(data);
  const updateData = {};

  if (normalizedData.name !== undefined) {
    validateUserName(normalizedData.name);
    updateData.name = normalizedData.name;
  }

  if (normalizedData.email !== undefined) {
    validateEmailFormat(normalizedData.email);
    await assertEmailAvailableForUpdate(normalizedData.email, userId);
    updateData.email = normalizedData.email;
  }

  if (normalizedData.password !== undefined) {
    validatePassword(normalizedData.password);
    updateData.password = await hashPassword(normalizedData.password);
  }

  if (normalizedData.studentId !== undefined) {
    validateStudentIdValue(normalizedData.studentId);
    updateData.studentId = normalizedData.studentId;
  }

  for (const field of ["avatarUrl", "coverUrl", "bio", "university", "major"]) {
    if (normalizedData[field] !== undefined) {
      validateStringField(field, normalizedData[field]);
      updateData[field] = normalizedData[field];
    }
  }

  if (normalizedData.age !== undefined) {
    validateNumberField("age", normalizedData.age, { min: 0 });
    updateData.age = normalizedData.age;
  }

  if (normalizedData.academicYear !== undefined) {
    validateNumberField("academicYear", normalizedData.academicYear, {
      min: 1,
      max: 10,
    });
    updateData.academicYear = normalizedData.academicYear;
  }

  if (normalizedData.gender !== undefined) {
    validateEnumField("gender", normalizedData.gender, GENDERS);
    updateData.gender = normalizedData.gender;
  }

  if (normalizedData.relationshipStatus !== undefined) {
    validateEnumField(
      "relationshipStatus",
      normalizedData.relationshipStatus,
      RELATIONSHIP_STATUSES,
    );
    updateData.relationshipStatus = normalizedData.relationshipStatus;
  }

  for (const field of STRING_ARRAY_FIELDS) {
    if (normalizedData[field] !== undefined) {
      validateStringArrayField(field, normalizedData[field]);
      updateData[field] = normalizedData[field];
    }
  }

  if (normalizedData.socialLinks !== undefined) {
    validateSocialLinks(normalizedData.socialLinks);

    for (const field of SOCIAL_LINK_FIELDS) {
      if (normalizedData.socialLinks[field] !== undefined) {
        updateData[`socialLinks.${field}`] = normalizedData.socialLinks[field];
      }
    }
  }

  if (allowAdminFields && normalizedData.role !== undefined) {
    validateUserRole(normalizedData.role);
    updateData.role = normalizedData.role;
  }

  if (allowAdminFields && normalizedData.status !== undefined) {
    validateEnumField("status", normalizedData.status, USER_STATUSES);
    updateData.status = normalizedData.status;
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError("No valid fields to update", 400);
  }

  return updateData;
};

export const createUser = async (data) => {
  await validateCreateInput(data);

  const normalizedData = normalizeCreateData(data);
  const createData = pickProfileFields(normalizedData);
  createData.password = await hashPassword(normalizedData.password);
  createData.role = ["student", "teacher"].includes(normalizedData.role)
    ? normalizedData.role
    : "student";
  createData.status = "active";

  if (normalizedData.socialLinks) {
    createData.socialLinks = normalizedData.socialLinks;
  }

  try {
    const user = await UserModel.create(createData);
    return toSafeUser(user);
  } catch (err) {
    handleDuplicateKeyError(err);
  }
};

export const createUserByAdmin = async (data, role) => {
  await validateCreateInput(data);

  const normalizedData = normalizeCreateData(data);
  const normalizedRole =
    typeof role === "string" ? role.trim().toLowerCase() : role;
  validateUserRole(normalizedRole);

  const createData = pickProfileFields(normalizedData);
  createData.password = await hashPassword(normalizedData.password);
  createData.role = normalizedRole;
  createData.status = "active";

  if (normalizedData.socialLinks) {
    createData.socialLinks = normalizedData.socialLinks;
  }

  try {
    const user = await UserModel.create(createData);
    return toSafeUser(user);
  } catch (err) {
    handleDuplicateKeyError(err);
  }
};

export const getUsers = async (page = 1, limit = 10) => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.max(Number(limit) || 10, 1);
  const skip = (currentPage - 1) * pageLimit;

  const [users, total] = await Promise.all([
    UserModel.find({ status: "active" })
      .select(publicUserProjection)
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 }),
    UserModel.countDocuments({ status: "active" }),
  ]);

  return {
    users,
    page: currentPage,
    limit: pageLimit,
    pageNumber: Math.ceil(total / pageLimit),
    total,
  };
};

export const getUserById = async (id) => {
  validateObjectId(id);

  const user = await UserModel.findOne({ _id: id, status: "active" }).select(
    publicUserProjection,
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const getCurrentUser = async (id) => getUserById(id);

export const getUserByName = async (name, page = 1, limit = 20) => {
  if (!name || typeof name !== "string") {
    throw new AppError("Name is required", 400);
  }

  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.max(Number(limit) || 20, 1);
  const skip = (currentPage - 1) * pageLimit;

  return UserModel.find({
    name: { $regex: escapedName, $options: "i" },
    status: "active",
  })
    .select(publicUserProjection)
    .skip(skip)
    .limit(pageLimit)
    .sort({ createdAt: -1 });
};

export const updateUser = async (data, id) => {
  validateObjectId(id);

  const updateData = await buildUpdateData(data, id);
  let user;

  try {
    user = await UserModel.findOneAndUpdate(
      { _id: id, status: "active" },
      { $set: updateData },
      { new: true, runValidators: true },
    );
  } catch (err) {
    handleDuplicateKeyError(err);
  }

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toSafeUser(user);
};

export const updateUserByAdmin = async (data, id) => {
  validateObjectId(id);

  const updateData = await buildUpdateData(data, id, {
    allowAdminFields: true,
  });
  let user;

  try {
    user = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );
  } catch (err) {
    handleDuplicateKeyError(err);
  }

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toSafeUser(user);
};

export const deleteUser = async (id) => {
  validateObjectId(id);

  const user = await UserModel.findByIdAndDelete(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return { message: `User ${id} was deleted` };
};

export const lockUser = async (id) => {
  validateObjectId(id);

  const user = await UserModel.findByIdAndUpdate(
    id,
    { $set: { status: "banned" } },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    message: `User ${id} was locked`,
  };
};

export const unlockUser = async (id) => {
  validateObjectId(id);

  const user = await UserModel.findByIdAndUpdate(
    id,
    { $set: { status: "active" } },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    message: `User ${id} was unlocked`,
  };
};
