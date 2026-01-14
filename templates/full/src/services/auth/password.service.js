import crypto from "node:crypto";

import jwt from "jsonwebtoken";

import { RefreshToken } from "../../models/RefreshToken.js";
import { User } from "../../models/User.js";
import {
  authenticationError,
  invalidCredentialsError,
  resourceNotFoundError,
  tokenExpiredError,
  invalidTokenError,
} from "../../utils/error-factories.js";
import { logger } from "../../utils/logger.js";
import { comparePassword, hashPassword } from "../../utils/password.js";

const RESET_TOKEN_EXPIRES_IN = process.env.PASSWORD_RESET_EXPIRES_IN || "1h";
const RESET_TOKEN_EXPIRES_MS =
  +process.env.PASSWORD_RESET_EXPIRES_IN_MS || 60 * 60 * 1000;
const RESET_TOKEN_SECRET =
  process.env.PASSWORD_RESET_TOKEN_SECRET || process.env.JWT_ACCESS_SECRET;

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw resourceNotFoundError("User");
  }

  const hasOAuth =
    user.oauth?.google?.id ||
    user.oauth?.github?.id ||
    user.oauth?.facebook?.id;
  if (hasOAuth) {
    throw authenticationError(
      "OAuth users cannot change password. Please use your social account login."
    );
  }

  const isPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw invalidCredentialsError("Current password is incorrect");
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  logger.info("Password changed successfully", { userId });
};

export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user || !user.isActive) {
    logger.warn("Password reset requested for inactive or missing user", {
      email,
    });
    return null;
  }

  const token = jwt.sign(
    { userId: user._id.toString(), type: "password_reset" },
    RESET_TOKEN_SECRET,
    {
      expiresIn: RESET_TOKEN_EXPIRES_IN,
      algorithm: "HS256",
      jwtid: crypto.randomUUID(),
    }
  );
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  user.passwordResetToken = tokenHash;
  user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_EXPIRES_MS);
  await user.save();

  logger.info("Password reset token created", { userId: user._id.toString() });
  return token;
};

export const resetPassword = async (token, newPassword) => {
  try {
    jwt.verify(token, RESET_TOKEN_SECRET, { algorithms: ["HS256"] });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw tokenExpiredError("Password reset token expired");
    }
    throw invalidTokenError("Invalid password reset token");
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const now = new Date();
  const user = await User.findOne({
    passwordResetToken: tokenHash,
    passwordResetExpires: { $gt: now },
  }).select("+password");

  if (!user || !user.isActive) {
    throw invalidTokenError("Invalid password reset token");
  }

  user.password = await hashPassword(newPassword);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  await RefreshToken.updateMany(
    { user: user._id, isRevoked: false },
    { isRevoked: true, revokedAt: now }
  );

  logger.info("Password reset successfully", { userId: user._id.toString() });
};
