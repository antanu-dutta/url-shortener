import argon2 from "argon2";
import fs from "fs/promises";
import User from "../models/user.model.js";
import {
  sendMailForPasswordChange,
  sendVerificationMail,
} from "../services/auth.service.js";
import { generateOTP } from "../utils/otp.js";
import { responseMessage } from "../utils/response.js";
import {
  passwordChangeSchema,
  registerSchema,
} from "../validators/auth.validators.js";
import { generateTokens } from "../utils/jwt.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import passwordOtpVerification from "../models/passwordChange.model.js";
import { isExpired } from "../utils/dateHelpers.js";
import { Session } from "../models/sessions.model.js";

export const register = async (req, res) => {
  try {
    // ✅ Validate request body using Zod
    const { data, error } = registerSchema.safeParse(req.body);
    if (error) {
      return res
        .status(400)
        .json(responseMessage(false, error?.issues?.[0]?.message));
    }

    const { email, password, name } = data;

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res
        .status(400)
        .json(responseMessage(false, "User already exists and verified"));
    }

    if (existingUser && !existingUser.isVerified) {
      // ✅ If user exists but not verified, resend OTP
      const otp = generateOTP();
      existingUser.emailVerificationOtp = otp;
      existingUser.emailVerificationOtpExpiresAt = new Date(
        Date.now() + 5 * 60 * 1000
      ); // 5 min expiry
      await existingUser.save();

      try {
        await sendVerificationMail(existingUser.email, otp);
      } catch (mailError) {
        console.error("❌ Failed to send verification email:", mailError);
        return res
          .status(500)
          .json(responseMessage(false, "Failed to send verification email"));
      }

      return res.json(responseMessage(true, "Verification email resent"));
    }

    // ✅ Hash password securely
    const hashedPassword = await argon2.hash(password);

    // ✅ Create new user with OTP
    const otp = generateOTP();
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      emailVerificationOtp: otp,
      emailVerificationOtpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
    });

    // ✅ Send email safely
    try {
      await sendVerificationMail(newUser.email, otp);
    } catch (mailError) {
      console.error("❌ Failed to send verification email:", mailError);
      return res
        .status(500)
        .json(
          responseMessage(
            false,
            "User created but failed to send verification email"
          )
        );
    }

    return res
      .status(201)
      .json(responseMessage(true, "User registered, verification email sent"));
  } catch (error) {
    console.error("❌ Error while registering user:", error.message);
    return res
      .status(500)
      .json(responseMessage(false, "Server error while registering user"));
  }
};

// function for verifying user
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate inputs
    if (!email || !otp) {
      return res
        .status(400)
        .json(responseMessage(false, "Email and OTP are required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json(responseMessage(false, "User not found, please register again"));
    }

    // OTP mismatch
    if (user.emailVerificationOtp !== otp) {
      return res
        .status(400)
        .json(responseMessage(false, "Invalid OTP, please try again"));
    }

    // OTP expired
    if (isExpired(user.emailVerificationOtpExpiresAt)) {
      await User.deleteOne({ _id: user._id });
      return res
        .status(400)
        .json(
          responseMessage(
            false,
            "OTP expired, please register again to continue"
          )
        );
    }

    // Mark as verified
    user.isVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationOtpExpiresAt = undefined;
    await user.save();

    return res.json(responseMessage(true, "Email verified successfully"));
  } catch (error) {
    console.error("Error while verifying email:", error.message);

    return res
      .status(500)
      .json(responseMessage(false, "Internal server error, try again later"));
  }
};

// function for uploading profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(responseMessage(false, "No file uploaded"));
    }

    // Upload to Cloudinary
    let result;
    try {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pics",
        resource_type: "image",
      });
    } catch (err) {
      // Cleanup local file if cloud upload fails
      await fs.unlink(req.file.path);
      return res
        .status(500)
        .json(responseMessage(false, "Cloudinary upload failed"));
    }

    // Update user profile picture
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      // Cleanup Cloudinary & local if user not found
      await fs.unlink(req.file.path);
      return res.status(404).json(responseMessage(false, "User not found"));
    }

    // Remove local file after successful upload
    await fs.unlink(req.file.path);

    return res.json(
      responseMessage(true, "Profile picture updated successfully", {
        profilePic: user.profilePic,
      })
    );
  } catch (error) {
    console.error("Upload error:", error.message);

    // Try cleanup if file still exists
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.warn("Failed to remove local file:", err.message);
      }
    }

    return res
      .status(500)
      .json(
        responseMessage(false, "Server error while uploading profile picture")
      );
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json(responseMessage(false, "Please enter email and password"));
    }

    // 2. Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json(responseMessage(false, "Invalid credentials"));
    }

    // 3. Check if verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json(responseMessage(false, "Please verify your email before login"));
    }

    // 4. Match password
    const isMatch = await argon2.verify(user.password, password.trim());
    if (!isMatch) {
      return res
        .status(401)
        .json(responseMessage(false, "Invalid credentials"));
    }

    // 6. Create new session
    const session = await Session.create({
      userId: user._id,
      ipAddress: req.headers["x-forwarded-for"] || req.ip,
      userAgent: req.headers["user-agent"] || "unknown",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    if (!session) {
      return res
        .status(500)
        .json(responseMessage(false, "Failed to create session"));
    }

    // 7. Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id,
      sessionId: session._id,
    });

    // 8. Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie("access_token", accessToken, cookieOptions);
    res.cookie("refresh_token", refreshToken, cookieOptions);

    // 9. Success
    return res.status(200).json(
      responseMessage(true, "Login successful", {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      })
    );
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(500)
      .json(responseMessage(false, "Server error while logging in"));
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const { name } = req.body;
    console.log(name);
    // 1. Validate ID
    if (!id) {
      return res
        .status(400)
        .json(responseMessage(false, "User ID is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json(responseMessage(false, "Invalid User ID format"));
    }

    // 2. Validate name if provided
    let updateData = {};
    if (name) {
      if (name.trim().length < 2) {
        return res
          .status(400)
          .json(responseMessage(false, "Please enter a valid name"));
      }
      updateData.name = name.trim();
    }

    // 3. Handle profile picture if uploaded
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile_pics",
          resource_type: "image",
        });
        updateData.profilePic = result.secure_url;

        // Remove local file after successful upload
        await fs.unlink(req.file.path);
      } catch (err) {
        if (req.file?.path) await fs.unlink(req.file.path);
        return res
          .status(500)
          .json(responseMessage(false, "Failed to upload profile picture"));
      }
    }

    // 4. Update user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updatedUser) {
      return res.status(404).json(responseMessage(false, "User not found"));
    }

    // 5. Success response
    return res
      .status(200)
      .json(responseMessage(true, "User updated successfully", updatedUser));
  } catch (error) {
    console.error("Error while updating user:", error.message);

    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.warn("Failed to remove local file:", err.message);
      }
    }

    return res
      .status(500)
      .json(responseMessage(false, "Server error, please try again later"));
  }
};

// 📩 Send Password OTP
export const sendPasswordOtp = async (req, res) => {
  try {
    let { email } = req.body;

    // 1. Validate email
    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json(responseMessage(false, "Please enter a valid email"));
    }
    email = email.trim().toLowerCase();

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(responseMessage(false, "User not found"));
    }

    // 3. Generate OTP
    const otp = generateOTP();

    // 4. Delete existing OTPs for this user
    await passwordOtpVerification.deleteMany({ userId: user._id });

    // 5. Store new OTP in DB
    await passwordOtpVerification.create({
      userId: user._id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expires in 5 mins
    });

    // 6. Send email
    try {
      await sendMailForPasswordChange(user.email, user.name, otp);
    } catch (mailErr) {
      console.error("📧 Email sending failed:", mailErr);
      return res
        .status(500)
        .json(responseMessage(false, "Failed to send OTP email"));
    }

    // 7. Success response
    return res.status(200).json(responseMessage(true, "OTP sent successfully"));
  } catch (error) {
    console.error("❌ Error while sending password OTP:", error.message);
    return res
      .status(500)
      .json(responseMessage(false, "Server error while sending OTP"));
  }
};

// 🔐 Verify Password OTP
export const verifyPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otp || !email) {
      return res
        .status(400)
        .json(responseMessage(false, "Email and OTP are required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(responseMessage(false, "User not found"));
    }

    const passwordStore = await passwordOtpVerification.findOne({
      userId: user._id,
    });

    if (!passwordStore) {
      return res
        .status(400)
        .json(responseMessage(false, "Please request a new OTP"));
    }

    if (isExpired(passwordStore.expiresAt)) {
      await passwordOtpVerification.deleteOne({ userId: user._id }); // remove expired OTP
      return res.status(400).json(responseMessage(false, "OTP has expired"));
    }

    if (passwordStore.otp !== otp) {
      return res.status(400).json(responseMessage(false, "Invalid OTP"));
    }

    // OTP verified → remove it from DB
    await passwordOtpVerification.deleteOne({ userId: user._id });

    return res.json(responseMessage(true, "OTP verified successfully"));
  } catch (error) {
    console.error("❌ Error while verifying OTP:", error);
    return res
      .status(500)
      .json(responseMessage(false, "Server error while verifying OTP"));
  }
};

// 🔑 Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { data, error } = passwordChangeSchema.safeParse(req.body);
    if (error) {
      return res
        .status(400)
        .json(responseMessage(false, error?.issues?.[0]?.message));
    }

    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(responseMessage(false, "User not found"));
    }

    const hashed = await argon2.hash(password);
    user.password = hashed;
    await user.save();

    return res.json(responseMessage(true, "Password reset successfully"));
  } catch (error) {
    console.error("❌ Error while resetting password:", error);
    return res
      .status(500)
      .json(responseMessage(false, "Server error while resetting password"));
  }
};

// change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json(
          responseMessage(false, "Please provide both current and new password")
        );
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user)
      return res.status(404).json(responseMessage(false, "User not found"));

    // 3. Verify current password
    const isMatch = await argon2.verify(user.password, currentPassword.trim());
    if (!isMatch) {
      return res
        .status(401)
        .json(responseMessage(false, "Current password is incorrect"));
    }

    // 4. Hash new password
    const hashed = await argon2.hash(newPassword.trim());

    // 5. Save new password
    user.password = hashed;
    await user.save();

    return res.json(responseMessage(true, "Password changed successfully"));
  } catch (error) {
    console.error("Error while changing password:", error);
    return res
      .status(500)
      .json(responseMessage(false, "Server error while changing password"));
  }
};

// 📩 Resend Password OTP
export const resendPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(responseMessage(false, "Please enter a valid email"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(responseMessage(false, "User not found"));
    }

    // Remove any existing OTP before sending new one
    await passwordOtpVerification.deleteMany({ userId: user._id });

    const otp = generateOTP();

    // Send OTP email
    await sendMailForPasswordChange(user.email, user.name, otp);

    // Save new OTP
    await passwordOtpVerification.create({
      userId: user._id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
    });

    return res.json(responseMessage(true, "New OTP sent successfully"));
  } catch (error) {
    console.error("❌ Error while resending password OTP:", error);
    return res
      .status(500)
      .json(responseMessage(false, "Server error while resending OTP"));
  }
};

export const getMe = async (req, res) => {
  try {
    // The `protect` middleware should already have set `req.user`
    if (!req.user) {
      return res.status(401).json(responseMessage(false, "Not authenticated"));
    }

    // Optionally, fetch the latest user data from DB (if needed)
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json(responseMessage(false, "User not found"));
    }

    // Respond with user info
    return res
      .status(200)
      .json(responseMessage(true, "User fetched successfully", user));
  } catch (error) {
    console.error("Error in getMe:", error);
    res
      .status(500)
      .json(responseMessage(false, "Server error while fetching user"));
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.user) return res.responseMessage(false, "You are not logged in");
    await Session.findOneAndDelete({ userId: req.user._id });
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.json(responseMessage(true, "user logged out"));
  } catch (error) {
    console.err("error while logging out an user");
  }
};
