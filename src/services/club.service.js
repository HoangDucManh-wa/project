import { clubModel } from "../models/club.model.js";
import { userModel } from "../models/user.model.js";
import AppError from "../utils/AppError.js";

async function validateInput(data) {
  if (!data) {
    throw new AppError("invalid data", 400);
  }

  const { clubName, member, description } = data; // ✅ thêm description

  if (!clubName) {
    throw new AppError("clubName is required", 400);
  }

  if (typeof clubName !== "string") {
    throw new AppError("Type of clubName must be string", 400);
  }

  // ✅ validate description (nhẹ, đúng style cũ)
  if (description !== undefined && typeof description !== "string") {
    throw new AppError("description must be string", 400);
  }

  if (member !== undefined) {
    if (!Array.isArray(member)) {
      throw new AppError("member must be an array", 400);
    }
    for (let i = 0; i < member.length; i++) {
      let x = member[i];
      if (!x || typeof x !== "object") {
        throw new AppError(`Typeof member not valid at index: ${i}`, 400);
      }
      if (!x.user) {
        throw new AppError(
          `user in array member is required at index: ${i}`,
          400,
        );
      }
      const user = await userModel.findById(x.user);
      if (!user) {
        throw new AppError(`Member user not found at index: ${i}`, 404);
      }
      if (
        x.clubRole !== undefined &&
        x.clubRole !== "member" &&
        x.clubRole !== "vice-president" &&
        x.clubRole !== "president"
      ) {
        throw new AppError(`clubRole not valid at index: ${i}`, 400);
      }
    }
  }
}

const createClub = async (data) => {
  await validateInput(data);

  const { clubName, member, description } = data; // ✅ thêm description

  const club = await clubModel.create({
    clubName,
    member,
    description, // ✅ thêm vào DB
  });

  return club;
};

const updateClubName = async (clubName, id) => {
  if (!clubName) {
    throw new AppError("missing updateData", 400);
  }
  if (!id) {
    throw new AppError("missing id", 400);
  }

  if (typeof clubName !== "string") {
    throw new AppError("typeof clubName invalid", 400);
  }

  const club = await clubModel.findByIdAndUpdate(
    id,
    { clubName },
    { new: true },
  );

  if (!club) {
    throw new AppError("Club not found", 404);
  }

  return club;
};

const updateMember = async (userId, clubId, index, clubRole) => {
  if (!clubId || !userId || (index !== 0 && !index)) {
    throw new AppError("data invalid", 400);
  }

  index = Number(index);

  if (!Number.isInteger(index)) {
    throw new AppError("invalid index", 400);
  }

  const club = await clubModel.findById(clubId);
  if (!club) {
    throw new AppError("Club not found", 404);
  }

  const user = await userModel.findById(userId);
  if (!user) {
    throw new AppError("UserId not found", 404);
  }

  if (club.member.length <= index || index < 0) {
    throw new AppError("Invalid member index", 400);
  }

  for (let i = 0; i < club.member.length; i++) {
    if (userId === club.member[i].user.toString()) {
      if (i !== index) {
        throw new AppError(
          "club is not allowed to have two identical user IDs.",
          409,
        );
      }
    }
  }

  club.member[index].user = userId;

  if (clubRole) {
    if (
      clubRole !== "member" &&
      clubRole !== "vice-president" &&
      clubRole !== "president"
    ) {
      throw new AppError("invalid clubRole", 400);
    }
    club.member[index].clubRole = clubRole;
  }

  await club.save();
  return club;
};

const addMember = async (idUser, idClub, clubRole) => {
  if (!idUser || !idClub) {
    throw new AppError("idUser and idClub not null", 400);
  }

  const user = await userModel.findById(idUser);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const club = await clubModel.findById(idClub);
  if (!club) {
    throw new AppError("Club not found", 404);
  }

  if (
    clubRole !== undefined &&
    clubRole !== "member" &&
    clubRole !== "vice-president" &&
    clubRole !== "president"
  ) {
    throw new AppError("invalid clubRole", 400);
  }

  for (let i = 0; i < club.member.length; i++) {
    if (club.member[i].user.toString() === idUser) {
      throw new AppError("concide idUser", 409);
    }
  }

  club.member.push({
    user: idUser,
    clubRole: clubRole,
  });

  await club.save();
  return club;
};

const deleteMember = async (idUser, idClub) => {
  if (!idUser || !idClub) {
    throw new AppError("idUser and idClub not null", 400);
  }

  const club = await clubModel.findById(idClub);
  if (!club) {
    throw new AppError("Club not found", 404);
  }

  let find = false;

  for (let i = 0; i < club.member.length; i++) {
    if (idUser === club.member[i].user.toString()) {
      find = true;
      club.member.splice(i, 1);
      break;
    }
  }

  if (!find) {
    throw new AppError("idUser not found in club", 404);
  }

  await club.save();
  return club;
};

export { createClub, updateClubName, updateMember, addMember, deleteMember };
