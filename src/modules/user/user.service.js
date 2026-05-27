import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { UserModel } from "./user.model.js";
import {
  validateObjectId,
  validateEmail,
  validateAge,
  validatePassword,
  validateStudentId,
  validateUserName,
  validateUserRole,
  validateGender,
  validateRelationshipStatus,
  validateUniversity,
  validateMajor,
  validateAcademicYear,
  validateCareerPaths,
  validateTechStacks,
  validateSkills,
  validateInterests,
  validateBio,
  validateAvatarUrl,
  validateCoverUrl,
  validateSocialLinks,
  validateUserStatus,
} from "./user.validate.js";
import AppError from "../../shared/utils/AppError.js";

const SALT_ROUNDS = 10;
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

const handleDuplicateKeyError = (err) => {
  if (err?.code !== 11000) {
    throw err;
  }

  const fields = Object.keys(err.keyPattern || err.keyValue || {});

  if (fields.includes("email")) {
    throw new AppError("Email already existed", 409);
  }

  if (fields.includes("studentId") && fields.includes("university")) {
    throw new AppError("Student id already existed in this university", 409);
  }

  throw new AppError("User already existed", 409);
};

const normalizeUserData = (data) => ({
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

  const normalizedData = normalizeUserData(data);

  validateUserName(normalizedData.name);
  await validateEmail(normalizedData.email);
  validatePassword(normalizedData.password);
  validateStudentId(normalizedData.studentId);
  validateAvatarUrl(normalizedData.avatarUrl);
  validateCoverUrl(normalizedData.coverUrl);
  validateBio(normalizedData.bio);
  validateAge(normalizedData.age);
  validateGender(normalizedData.gender);
  validateRelationshipStatus(normalizedData.relationshipStatus);
  validateUniversity(normalizedData.university);
  validateMajor(normalizedData.major);
  validateAcademicYear(normalizedData.academicYear);
  validateCareerPaths(normalizedData.careerPaths);
  validateTechStacks(normalizedData.techStacks);
  validateSkills(normalizedData.skills);
  validateInterests(normalizedData.interests);
  validateSocialLinks(normalizedData.socialLinks);
};

const buildUpdateData = async (
  data,
  userId,
  { allowAdminFields = false } = {},
) => {
  if (!data) {
    throw new AppError("Data is required", 400);
  }
  const normalizedData = normalizeUserData(data);
  const updateData = {};
  if (normalizedData.name !== undefined) {
    validateUserName(normalizedData.name);
    updateData.name = normalizedData.name;
  }
  if (normalizedData.email !== undefined) {
    validateEmail(normalizedData.email, userId);
    updateData.email = normalizedData.email;
  }
  if (normalizedData.password !== undefined) {
    validatePassword(normalizedData.password);
    updateData.password = await hashPassword(normalizedData.password);
  }
  if (normalizedData.studentId !== undefined) {
    validateStudentId(normalizedData.studentId);
    updateData.studentId = normalizedData.studentId;
  }
  if (normalizedData.avatarUrl !== undefined) {
    validateAvatarUrl(normalizedData.avatarUrl);
    updateData.avatarUrl = normalizedData.avatarUrl;
  }
  if (normalizedData.coverUrl !== undefined) {
    validateCoverUrl(normalizedData.coverUrl);
    updateData.coverUrl = normalizedData.coverUrl;
  }
  if (normalizedData.bio !== undefined) {
    validateBio(normalizedData.bio);
    updateData.bio = normalizedData.bio;
  }
  if (normalizedData.age !== undefined) {
    validateAge(normalizedData.age);
    updateData.age = normalizedData.age;
  }
  if (normalizedData.gender !== undefined) {
    validateGender(normalizedData.gender);
    updateData.gender = normalizedData.gender;
  }
  if (normalizedData.relationshipStatus !== undefined) {
    validateRelationshipStatus(normalizedData.relationshipStatus);
    updateData.relationshipStatus = normalizedData.relationshipStatus;
  }
  if (normalizedData.university !== undefined) {
    validateUniversity(normalizedData.university);
    updateData.university = normalizedData.university;
  }
  if (normalizedData.major !== undefined) {
    validateMajor(normalizedData.major);
    updateData.major = normalizedData.major;
  }
  if (normalizedData.academicYear !== undefined) {
    validateAcademicYear(normalizedData.academicYear);
    updateData.academicYear = normalizedData.academicYear;
  }
  if (normalizedData.careerPaths !== undefined) {
    validateCareerPaths(normalizedData.careerPaths);
    updateData.careerPaths = normalizedData.careerPaths;
  }
  if (normalizedData.techStacks !== undefined) {
    validateTechStacks(normalizedData.techStacks);
    updateData.techStacks = normalizedData.techStacks;
  }
  if (normalizedData.skills !== undefined) {
    validateSkills(normalizedData.skills);
    updateData.skills = normalizedData.skills;
  }
  if (normalizedData.interests !== undefined) {
    validateInterests(normalizedData.interests);
    updateData.interests = normalizedData.interests;
  }
  if (normalizedData.socialLinks !== undefined) {
    validateSocialLinks(normalizedData.socialLinks);
    if (normalizedData.socialLinks === null) {
      updateData.socialLinks = normalizedData.socialLinks;
    } else {
      for (const field of SOCIAL_LINK_FIELDS) {
        if (normalizedData.socialLinks[field] !== undefined) {
          updateData[`socialLinks.${field}`] =
            normalizedData.socialLinks[field];
        }
      }
    }
  }

  if (allowAdminFields && normalizedData.role !== undefined) {
    validateUserRole(normalizedData.role);
    updateData.role = normalizedData.role;
  }

  if (allowAdminFields && normalizedData.status !== undefined) {
    validateUserStatus(normalizedData.status);
    updateData.status = normalizedData.status;
  }
  return updateData;
};

export const createUser = async (data, role) => {
  await validateCreateInput(data);

  const normalizedData = normalizeUserData(data);
  const createData = normalizedData;
  createData.password = await hashPassword(normalizedData.password);
  if (role !== "admin") {
    createData.role = ["student", "teacher"].includes(normalizedData.role)
      ? normalizedData.role
      : "student";
  }
  createData.status = "active";
  const user = await UserModel.create(createData);
  return toSafeUser(user);
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

export const updateUser = async (data, id, role) => {
  validateObjectId(id);
  let checkRole = role === "admin";
  const updateData = await buildUpdateData(data, id, {
    allowAdminFields: checkRole,
  });
  let user;
  user = await UserModel.findOneAndUpdate(
    { _id: id, status: "active" },
    { $set: updateData },
    { new: true, runValidators: true },
  );
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
