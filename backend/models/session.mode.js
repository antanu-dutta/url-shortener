// models/Session.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User model
      required: true,
    },

    valid: {
      type: Boolean,
      default: true, // session is valid unless user logs out or revoked
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
      // TTL index -> session auto-deletes when expiresAt time is reached
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
