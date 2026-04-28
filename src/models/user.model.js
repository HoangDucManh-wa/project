import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    // Allows null studentId and duplicate values across different universities.
    studentId: {
      type: String,
      trim: true,
    },

    university: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
  },
  { timestamps: true },
);

// Compound unique index
userSchema.index(
  { studentId: 1, university: 1 },
  { unique: true, sparse: true },
);

export const userModel = mongoose.model("User", userSchema);
