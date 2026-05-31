import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 1,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },

    category: {
      type: String,
      enum: ["academic", "sports", "volunteer", "other"],
      trim: true,
      required: true,
    },

    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // bổ sung
    university: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    socialLinks: {
      facebook: {
        type: String,
        maxlength: 800,
        trim: true,
        default: "",
      },

      website: {
        type: String,
        trim: true,
        maxlength: 800,
        default: "",
      },
    },

    // bổ sung
    stats: {
      posts: {
        type: Number,
        default: 0,
        max: 200,
      },
      maxMemberCount: {
        type: Number,
        default: 100,
        max: 150,
      },
      memberCount: {
        type: Number,
        default: 0,
        min: 0,
        max: 150,
      },
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
