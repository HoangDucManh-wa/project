import AppError from "../utils/AppError.js";
import validator from "validator";
import mongoose from "mongoose";
export const validateObjectId = (id) => {
  let check = mongoose.Types.ObjectId.isValid(id);
  if (!check) {
    throw new AppError("invalid Id", 400);
  }
};
export const validateStringField = (field, data, required = false) => {
  if (data === null || data === undefined) {
    if (required) {
      throw new AppError(`${field} is required`, 400);
    }
    return 0;
  }
  if (typeof data !== "string") {
    throw new AppError(`${field} must be string`, 400);
  }
  if (data.trim() === "") {
    if (required) {
      throw new AppError(`${field} is required`, 400);
    }
  }
};
//Only operate correctly if we make sure that data is string
export const validateStringLength = (field, data, min = 0, max = 100) => {
  let length = data.length;
  if (length < min) {
    throw new AppError(`${field} must be at least ${min} characters long`, 400);
  }
  if (length > max) {
    throw new AppError(`${field} must be at max ${max} characters long`, 400);
  }
};

export const validateEnumField = (
  field,
  data = [],
  enumData = [],
  require = false,
) => {
  if (data === null || data === undefined) {
    if (!require) return 0;
    throw new AppError(`${field} is required`, 400);
  }
  // if data is an array
  if (Array.isArray(data)) {
    if (data.length === 0) {
      if (!require) return 0;
      throw new AppError(`invalid ${field}`, 400);
    }
    data.forEach((x) => {
      if (!enumData.includes(x)) {
        throw new AppError(
          `${field} only contains ${enumData.join(", ")}`,
          400,
        );
      }
    });
  } else if (typeof data === "string") {
    if (!enumData.includes(data)) {
      throw new AppError(`${field} only contains ${enumData}`, 400);
    }
  } else if (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data)
  ) {
    let keys = Object.keys(data);
    if (keys.length === 0) {
      if (require) {
        throw new AppError(`${field} is required`, 400);
      }
      return 0;
    }
    for (let x of keys) {
      if (!enumData.includes(x)) {
        throw new AppError(`${field} only contains ${enumData.join(", ")}`);
      }
    }
  } else {
    throw new AppError(`The type of ${field} is invalid`, 400);
  }
};
// If ghe type is an object
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

    return 0;
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
  let result = validateNumberField(field, data, min, max, required);
  if (result === 0) return;

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
    return 0;
  }

  if (!Array.isArray(array)) {
    throw new AppError(`${fieldName} must be an array`, 400);
  }

  for (const item of array) {
    validateStringField(fieldName, item, true);
    validateStringLength(fieldName, item, minStringLength, maxStringLength);
  }
};
