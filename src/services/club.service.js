import { clubModel } from "../models/club.model.js";
import { userModel } from "../models/user.model.js";
async function validateInput(data) {
  if (!data) {
    throw new Error("invalid data");
  }

  const { clubName, member } = data;

  if (!clubName) {
    throw new Error("clubName is required");
  }

  if (typeof clubName !== "string") {
    throw new Error("Type of clubName must be string");
  }

  if (member !== undefined) {
    if (!Array.isArray(member)) {
      throw new Error("member must be an array");
    }
    for (let i = 0; i < member.length; i++) {
      let x = member[i];
      if (!x || typeof x !== "object") {
        throw new Error("Typeof member not valid at index: " + i);
      }
      if (!x.user) {
        throw new Error("user in array member is required at index: " + i);
      }
      const user = await userModel.findById(x.user);
      if (!user) {
        throw new Error(`Member user not found at index: ` + i);
      }
      if (
        x.clubRole !== undefined &&
        x.clubRole !== "member" &&
        x.clubRole !== "vice-president" &&
        x.clubRole !== "president"
      ) {
        throw new Error(`clubRole not valid at index: ${i}`);
      }
    }
  }
}
const createClub = async (data) => {
  await validateInput(data);
  const { clubName, member } = data;
  const club = await clubModel.create({ clubName, member });
  return club;
};
const updateClubName = async (clubName, id) => {
  if (!clubName) {
    throw new Error("missing updateData");
  }
  if (!id) {
    throw new Error("missing id");
  }

  if (typeof clubName !== "string") {
    throw new Error("typeof clubName invalid");
  }
  const club = await clubModel.findByIdAndUpdate(
    id,
    {
      clubName,
    },
    { new: true },
  );
  if (!club) {
    throw new Error("Club not found");
  }
  return club;
};
const updateMember = async (userId, clubId, index, clubRole) => {
  if (!clubId || !userId || (index !== 0 && !index)) {
    throw new Error("data invalid");
  }
  index = Number(index);
  if (!Number.isInteger(index)) {
    throw new Error("invalid index");
  }
  const club = await clubModel.findById(clubId);

  if (!club) {
    throw new Error("Club not found");
  }
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("UserId not found");
  }
  if (club.member.length <= index || index < 0) {
    throw new Error("Invalid member index");
  }
  for (let i = 0; i < club.member.length; i++) {
    if (userId === club.member[i].user.toString()) {
      if (i !== index) {
        throw new Error("club is not allowed to have two identical user IDs.");
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
      throw new Error("invalid clubRole");
    }
    club.member[index].clubRole = clubRole;
  }
  await club.save();
  return club;
};
const addMember = async (idUser, idClub, clubRole) => {
  if (!idUser || !idClub) {
    throw new Error("idUser and idClub not null");
  }
  const user = await userModel.findById(idUser);
  if (!user) {
    throw new Error("User not found");
  }
  const club = await clubModel.findById(idClub);
  if (!club) {
    throw new Error("Club not found");
  }
  if (
    clubRole !== undefined &&
    clubRole !== "member" &&
    clubRole !== "vice-president" &&
    clubRole !== "president"
  ) {
    throw new Error("invalid clubRole");
  }
  for (let i = 0; i < club.member.length; i++) {
    if (club.member[i].user.toString() === idUser) {
      throw new Error("concide idUser");
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
    throw new Error("idUser and idClub not null");
  }
  const club = await clubModel.findById(idClub);
  if (!club) {
    throw new Error("Club not found");
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
    throw new Error("idUser not found in club");
  }
  await club.save();
  return club;
};
export { createClub, updateClubName, updateMember, addMember, deleteMember };
