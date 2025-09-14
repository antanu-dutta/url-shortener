// models/User.js
import mongoose from "mongoose";
import argon2 from "argon2";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // don't return password in queries by default
    },

    emailVerificationOtp: {
      type: String, // store as string to avoid leading zeros
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationOtpExpiresAt: {
      type: Date,
      index: { expires: 0 },
      // TTL index: document is deleted automatically once expiresAt < current time
    },

    profilePic: {
      type: String,
      default: "https://www.gravatar.com/avatar/?d=mp",
    },
  },
  {
    timestamps: true,
  }
);

//
// 🔑 Password hashing before save
//
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next(); // only hash if password is new/modified
//   this.password = await argon2.hash(this.password);
//   next();
// });

//
// 🔑 Compare password method
//
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await argon2.verify(this.password, enteredPassword);
// };

const User = mongoose.model("User", userSchema);

export default User;
