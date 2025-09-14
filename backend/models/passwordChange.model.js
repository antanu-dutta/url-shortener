import mongoose from "mongoose";

const passwordOtpVerifcationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  otp: {
    type: String,
    default: undefined,
  },
  expiresAt: {
    type: Date,
    index: { expires: 0 },
  },
});

const passwordOtpVerification = mongoose.model(
  "passwordotp",
  passwordOtpVerifcationSchema
);

export default passwordOtpVerification;
