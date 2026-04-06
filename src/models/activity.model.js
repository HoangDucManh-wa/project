import mongoose from "mongoose";
const activitySchema = new mongoose.Schema(
  {
    activityName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["event", "competition"],
      default: "event",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);
export const activityModel = mongoose.model("Activity", activitySchema);
