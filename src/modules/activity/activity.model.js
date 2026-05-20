import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    activityName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["event", "competition"],
      default: "event",
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    maxParticipants: {
      type: Number,
      default: 100,
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "ended"],
      default: "upcoming",
    },
    participantsNumber: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Activity = mongoose.model("Activity", activitySchema);
