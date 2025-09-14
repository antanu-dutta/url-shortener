import { Session } from "../models/sessions.model.js";
import User from "../models/user.model.js";
import {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { responseMessage } from "../utils/response.js";

export const protect = async (req, res, next) => {
  try {
    const access_token = req.cookies?.access_token;
    const refresh_token = req.cookies?.refresh_token;
    req.user = null;

    // 1. Check if tokens exist
    if (!access_token && !refresh_token) {
      return res.status(401).json(responseMessage(false, "No token provided"));
    }

    // 2. Verify Access Token
    if (access_token) {
      console.log("in access");
      const decoded = verifyAccessToken(access_token);
      if (decoded) {
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
          return res.status(401).json(responseMessage(false, "User not found"));
        }
        req.user = user;
        return next();
      }
    }

    // 3. If Access Token is invalid/expired → try Refresh Token
    if (refresh_token) {
      console.log("in refresh");

      const decoded = verifyRefreshToken(refresh_token);

      if (!decoded) {
        return res.status(401).json(responseMessage(false, "Session expired"));
      }

      // Find session by sessionId
      const session = await Session.findById(decoded.sessionId);
      if (!session) {
        return res.status(401).json(responseMessage(false, "Invalid session"));
      }

      const user = await User.findById(session.userId).select("-password");
      if (!user) {
        return res.status(401).json(responseMessage(false, "User not found"));
      }

      req.user = user;

      // 4. Issue fresh tokens
      const { accessToken, refreshToken } = generateTokens({
        userId: user._id,
        sessionId: session._id,
      });

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return next();
    }

    return res.status(401).json(responseMessage(false, "Unauthorized"));
  } catch (error) {
    console.error("Error while authenticating user:", error);
    return res.status(500).json(responseMessage(false, "Auth server error"));
  }
};
