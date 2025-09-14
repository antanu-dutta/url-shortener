import jwt from "jsonwebtoken";

// Generate Tokens
export const generateTokens = ({ userId, sessionId }) => {
  const accessToken = jwt.sign(
    { userId }, // clear naming
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // short-lived
  );

  const refreshToken = jwt.sign(
    { sessionId }, // clear naming
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // long-lived
  );

  return { accessToken, refreshToken };
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null; // invalid or expired
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return null;
  }
};
