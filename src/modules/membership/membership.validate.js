import {
  validateObjectId,
  validateEnumField,
} from "../../shared/services/validate.service.js";
import { Membership } from "./membership.model.js";
import { UserModel } from "../user/user.model.js";
import { clubModel } from "../club/club.model.js";
export const validateUser = async (userId) => {
  validateObjectId(userId);
  const user = await UserModel.findById(userId);
  if (!user || user.status === "banned") {
    throw new AppError(`user not found`, 400);
  }
};
export const validateClub = async (clubId) => {
  validateObjectId(clubId);
  const club = await clubModel.findById(clubId);
  if (!club || club.status === "inactive") {
    throw new AppError(`club not found`, 400);
  }
};
export const validateRoleInClub = (role) => {
  validateEnumField(
    "roleInClub",
    role,
    ["member", "vice-president", "president"],
    true,
  );
};
