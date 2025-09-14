import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
    },
    shortCode: {
      type: String,
      required: [true, "Short code is required"],
      unique: true, // ensures no duplicates
    },
    redirectUrl: {
      type: String,
      required: [true, "Redirect URL is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // optional if URLs are tied to a user
      required: true,
    },
    clicks: {
      type: Number,
      default: 0, // track number of times the short URL was visited
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Optional: TTL index if you want URLs to auto-delete after expiration
const URL = mongoose.model("URL", urlSchema);

export default URL;
