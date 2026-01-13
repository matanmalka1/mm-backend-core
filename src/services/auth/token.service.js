import { RefreshToken } from "../../models/RefreshToken.js";
import { User } from "../../models/User.js";
import {
  hashRefreshToken,
  getRefreshTokenExpiration,
} from "../../utils/auth-helpers.js";
import {
  authenticationError,
  refreshTokenInvalidError,
} from "../../utils/error-factories.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { logger } from "../../utils/logger.js";

export const logout = async (userId, refreshToken) => {
  if (refreshToken) {
    const tokenHash = hashRefreshToken(refreshToken);

    await RefreshToken.updateOne(
      { token: tokenHash, user: userId },
      { isRevoked: true, revokedAt: new Date() }
    );
    logger.info("User logged out", { userId });
  }
};

export const refreshAccessToken = async (oldRefreshToken) => {
  const decoded = verifyRefreshToken(oldRefreshToken);
  const tokenHash = hashRefreshToken(oldRefreshToken);

  const tokenRecord = await RefreshToken.findOneAndUpdate(
    {
      token: tokenHash,
      user: decoded.userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    },
    { isRevoked: true, revokedAt: new Date() }
  );

  if (!tokenRecord) {
    throw refreshTokenInvalidError(
      "Invalid or already used/expired refresh token"
    );
  }

  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    throw authenticationError();
  }

  const newAccessToken = generateAccessToken({ userId: user._id.toString() });
  const newRefreshToken = generateRefreshToken({
    userId: user._id.toString(),
  });
  const expiresAt = getRefreshTokenExpiration();
  const newTokenHash = hashRefreshToken(newRefreshToken);

  await RefreshToken.create({
    token: newTokenHash,
    user: user._id,
    expiresAt,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
