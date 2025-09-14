import { Router } from "express";
import {
  register,
  verifyEmail,
  uploadProfilePicture,
  updateUser,
  login,
  sendPasswordOtp,
  resetPassword,
  verifyPasswordOtp,
  resendPasswordOtp,
  getMe,
  changePassword,
  logout,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/register", register);
router.put("/verify-email", verifyEmail);
router.post("/login", login);
router.put(
  "/profile/update/:id",
  protect,
  upload.single("profilePic"),
  updateUser
);
router.post("/send-password-otp", protect, sendPasswordOtp);
router.put("/change-password", protect, changePassword);
router.put("/verify-password-otp", protect, verifyPasswordOtp);
router.put("/reset-password", protect, resetPassword);
router.post("/resend-password-otp", protect, resendPasswordOtp);
router.get("/me", protect, getMe);
router.get("/logout", protect, logout);
router.put(
  "/upload-profile-pic",
  protect,
  upload.single("image"),
  uploadProfilePicture
);
export default router;
