import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    activityName: {
      type: String,
      required: true, // Tên sự kiện / hoạt động (bắt buộc)
    },

    description: String, // Mô tả chi tiết (nên có để user hiểu nội dung)

    type: {
      type: String,
      enum: ["event", "competition"], // Loại hoạt động
      default: "event",
    },

    startTime: Date, // Thời gian bắt đầu (quan trọng để hiển thị)
    endTime: Date, // Thời gian kết thúc

    location: String, // Địa điểm (offline) hoặc link (online)

    image: String, // Ảnh banner (phục vụ UI/UX)

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Người hoặc CLB tổ chức
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Danh sách người tham gia
      },
    ],

    maxParticipants: Number, // Giới hạn số người tham gia

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "ended"], // Trạng thái hoạt động
      default: "upcoming",
    },

    tags: [String], // Ví dụ: ["tech", "sport"] để filter
  },
  { timestamps: true },
);

export const activityModel = mongoose.model("Activity", activitySchema);
