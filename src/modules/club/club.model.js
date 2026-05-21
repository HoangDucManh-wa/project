import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      enum: ["academic", "sports", "volunteer", "other"],
      trim: true,
    },

    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    // bổ sung
    university: {
      type: String,
      trim: true,
      required: true,
    },

    socialLinks: {
      facebook: {
        type: String,
        trim: true,
        default: "",
      },

      website: {
        type: String,
        trim: true,
        default: "",
      },
    },

    // bổ sung
    stats: {
      posts: {
        type: Number,
        default: 0,
      },
    },

    memberCount: {
      type: Number,
      default: 0,
    },

    maxMemberCount: {
      type: Number,
      default: 100,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

export const clubModel = mongoose.model("Club", clubSchema);
