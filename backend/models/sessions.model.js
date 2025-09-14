import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    ipAddress: { type: String }, // optional
    userAgent: { type: String }, // optional
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);
