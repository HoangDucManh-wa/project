import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      required: true,
    },
    member: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        clubRole: {
          type: String,
          enum: ["member", "vice-president", "president"],
          default: "member",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const clubModel = mongoose.model("Club", clubSchema);
