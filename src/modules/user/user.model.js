import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // =========================
    // Basic Identity
    // =========================
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

    studentId: {
      type: String,
      trim: true,
      default: null,
    },

    // =========================
    // Profile
    // =========================
    avatarUrl: {
      type: String,
      default: "",
    },

    coverUrl: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },

    age: {
      type: Number,
      min: 0,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    relationshipStatus: {
      type: String,
      enum: ["single", "in_relationship", "married"],
      default: "single",
    },

    // =========================
    // Academic Information
    // =========================
    university: {
      type: String,
      trim: true,
    },

    major: {
      type: String,
      trim: true,
    },

    academicYear: {
      type: Number,
    },

    // =========================
    // Career
    // =========================
    careerPaths: [
      {
        type: String,
        trim: true,
      },
    ],

    techStacks: [
      {
        type: String,
        trim: true,
      },
    ],

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    interests: [
      {
        type: String,
        trim: true,
      },
    ],

    // =========================
    // Social Links
    // =========================
    socialLinks: {
      github: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },

      portfolio: {
        type: String,
        default: "",
      },

      facebook: {
        type: String,
        default: "",
      },
    },

    // =========================
    // Platform Stats
    // =========================
    stats: {
      followers: {
        type: Number,
        default: 0,
      },

      following: {
        type: Number,
        default: 0,
      },

      posts: {
        type: Number,
        default: 0,
      },
    },

    // =========================
    // System Fields
    // =========================
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// =====================================
// Indexes
// =====================================

// Student ID is only unique inside a university
userSchema.index(
  { studentId: 1, university: 1 },
  { unique: true, sparse: true },
);

// Text search
userSchema.index({
  name: "text",
  bio: "text",
  interests: "text",
  techStacks: "text",
  skills: "text",
});

// Export model
export const UserModel = mongoose.model("User", userSchema);
