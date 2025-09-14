import crypto from "crypto";

export const generateShortCode = (length = 6) => {
  return crypto
    .randomBytes(length)
    .toString("base64url") // URL-safe base64
    .substring(0, length);
};
