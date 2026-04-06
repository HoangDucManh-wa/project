import mongoose, { Mongoose } from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
    },
    university: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "admin", "club_admin"],
      default: "student",
    },
    clubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],
  },
  { timestamps: true },
);
export const userModel = mongoose.model("User", userSchema);
