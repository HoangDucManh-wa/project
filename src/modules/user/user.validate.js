import { UserModel } from "./user.model.js";
import AppError from "../../shared/utils/AppError.js";
import validator from "validator";
import {
  validateObjectId,
  validateStringField,
  validateStringLength,
  validateEnumField,
  validateIntegerField,
  validateStringArray,
} from "../../shared/services/validate.service.js";

export const validateEmail = async (email, userId = null) => {
  validateStringField("email", email, true);
  if (!validator.isEmail(email)) {
    throw new AppError("Invalid email", 400);
  }
  if (userId) {
    const existingUser = await UserModel.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new AppError("Email already existed", 409);
    }
  } else {
    const user = await UserModel.findOne({ email });
    if (user) {
      throw new AppError("Email already existed", 409);
    }
  }
};

export const validatePassword = (password) => {
  validateStringField("password", password, true);
  let lengthPassword = password.length;
  //3.1 Check lenght of password
  validateStringLength("Password", password, 8, 40);
  //3.2 Check so chu cai thuong,in hoa, so, va ky tu dac biet
  let a = 0,
    b = 0,
    c = 0,
    d = 0;
  for (let i = 0; i < lengthPassword; i++) {
    if (password[i] >= "a" && password[i] <= "z") {
      a++;
    } else if (password[i] >= "0" && password[i] <= "9") {
      b++;
    } else if (password[i] >= "A" && password[i] <= "Z") {
      c++;
    } else {
      d++;
    }
  }
  if (!(a && b && c && d)) {
    throw new AppError(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      400,
    );
  }
  //3.3 check space
  for (let i = 0; i < lengthPassword; i++) {
    if (password[i] === " ") {
      throw new AppError("Password must not contain spaces", 400);
    }
  }
};
export const validateStudentId = (studentId) => {
  let result = validateStringField("studentId", studentId, false);
  if (result === 0) return;
  if (studentId.includes(" ")) {
    throw new AppError("studentId must not contain spaces", 400);
  }
  for (let i = 0; i < studentId.length; i++) {
    if (!(studentId[i] >= "0" && studentId[i] <= "9")) {
      throw new AppError(
        "studentId only contains characters: {0,1,2,...9}",
        400,
      );
    }
  }
};
export const validateUserName = (name) => {
  validateStringField("userName", name, true);
  validateStringLength("userName", name, 2, 30);
};
export const validateUserRole = (role) => {
  validateEnumField("role", [role], ["student", "teacher", "admin"]);
};
export const validateGender = (gender) => {
  if (gender === undefined) return;
  validateEnumField("gender", [gender], ["male", "female", "other"]);
};
export const validateRelationshipStatus = (relationshipStatus) => {
  if (relationshipStatus === undefined) return;
  validateEnumField(
    `relationShipStatus`,
    [relationshipStatus],
    ["single", "in_relationship", "married"],
  );
};
export const validateAge = (age) => {
  validateIntegerField("age", age, 16, 100, false);
};

export const validateUniversity = (university) => {
  let result = validateStringField("university", university, false);
  if (result === 0) return;
  validateStringLength("university", university, 2, 100);
};

export const validateMajor = (major) => {
  let result = validateStringField("major", major, false);
  if (result === 0) return;
  validateStringLength("major", major, 1, 100);
};

export const validateAcademicYear = (academicYear) => {
  validateIntegerField("academicYear", academicYear, 1, 8, false);
};

export const validateCareerPaths = (careerPaths) => {
  validateStringArray("careerPaths", careerPaths, 1, 100);
};

export const validateTechStacks = (techStacks) => {
  validateStringArray("techStacks", techStacks, 1, 50);
};

export const validateSkills = (skills) => {
  validateStringArray("skills", skills, 1, 50);
};

export const validateInterests = (interests) => {
  validateStringArray("interests", interests, 1, 50);
};

export const validateBio = (bio) => {
  let result = validateStringField("bio", bio, false);
  if (result === 0) return;

  validateStringLength("bio", bio, 0, 500);
};

export const validateAvatarUrl = (avatarUrl) => {
  let result = validateStringField("avatarUrl", avatarUrl, false);
  if (result === 0) return;

  if (avatarUrl && !validator.isURL(avatarUrl)) {
    throw new AppError("Invalid avatarUrl", 400);
  }
};

export const validateCoverUrl = (coverUrl) => {
  let result = validateStringField("coverUrl", coverUrl, false);
  if (result === 0) return;

  if (coverUrl && !validator.isURL(coverUrl)) {
    throw new AppError("Invalid coverUrl", 400);
  }
};

export const validateSocialLinks = (socialLinks) => {
  if (socialLinks === undefined || socialLinks === null) return;
  if (
    !(
      typeof socialLinks === "object" &&
      !Array.isArray(socialLinks) &&
      socialLinks !== null
    )
  ) {
    throw new AppError("The type of socialLinks is invalid", 400);
  }
  const socialFields = ["github", "linkedin", "portfolio", "facebook"];
  validateEnumField("socialLinks", socialLinks, socialFields, false);
  for (const field of socialFields) {
    const value = socialLinks[field];

    let result = validateStringField(field, value, false);
    if (result !== 0) {
      if (value && !validator.isURL(value)) {
        throw new AppError(`Invalid ${field} url`, 400);
      }
    }
  }
};
export const validateUserStatus = (status) => {
  validateEnumField("status", [status], ["active", "banned"]);
};
