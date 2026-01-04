import { comparePassword, hashPassword } from "../utils/password.js";
import {
  User,
  Role,
  Permission,
  RefreshToken,
} from "../models/associations.js";
import { ApiError, API_ERROR_CODES } from "../constants/api-error-codes.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export const register = async (userData) => {
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new ApiError(
      API_ERROR_CODES.DUPLICATE_RESOURCE,
      "User with this email already exists",
      400
    );
  }

  const defaultRole = await Role.findOne({ where: { name: "user" } });
  if (!defaultRole) {
    throw new ApiError(
      API_ERROR_CODES.SERVER_ERROR,
      "Default role not found",
      500
    );
  }

  const user = await User.create({
    email: userData.email,
    password: await hashPassword(userData.password),
    firstName: userData.firstName,
    lastName: userData.lastName,
    roleId: defaultRole.id,
  });

  return { user };
};

export const login = async (email, password) => {
  const user = await User.findOne({
    where: { email },
    attributes: { include: ["password"] },
    include: [
      {
        model: Role,
        as: "role",
        include: [{ model: Permission, as: "permissions" }],
      },
    ],
  });

  if (!user || !user.isActive) {
    throw new ApiError(
      API_ERROR_CODES.INVALID_CREDENTIALS,
      "Invalid credentials",
      401
    );
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(
      API_ERROR_CODES.INVALID_CREDENTIALS,
      "Invalid credentials",
      401
    );
  }
  const accessToken = generateAccessToken({ userId: user.id });
  const refreshToken = generateRefreshToken({ userId: user.id });
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt,
  });
  await user.update({ lastLogin: new Date() });

  return { user, accessToken, refreshToken };
};

export const logout = async (userId, refreshToken) => {
  if (refreshToken) {
    await RefreshToken.update(
      { isRevoked: true, revokedAt: new Date() },
      { where: { token: refreshToken, userId } }
    );
  }
};
export const refreshAccessToken = async (oldRefreshToken) => {
  const decoded = verifyRefreshToken(oldRefreshToken);
  const tokenRecord = await RefreshToken.findOne({
    where: {
      token: oldRefreshToken,
      userId: decoded.userId,
    },
  });
  if (!tokenRecord || tokenRecord.isRevoked) {
    throw new ApiError(
      API_ERROR_CODES.REFRESH_TOKEN_INVALID,
      "Invalid refresh token",
      401
    );
  }
  if (new Date() > tokenRecord.expiresAt) {
    throw new ApiError(
      API_ERROR_CODES.REFRESH_TOKEN_EXPIRED,
      "Refresh token expired",
      401
    );
  }
  const user = await User.findByPk(decoded.userId);
  if (!user || !user.isActive) {
    throw new ApiError(
      API_ERROR_CODES.AUTHENTICATION_ERROR,
      "User not found or inactive",
      401
    );
  }
  await tokenRecord.update({ isRevoked: true, revokedAt: new Date() });
  const newAccessToken = generateAccessToken({ userId: user.id });
  const newRefreshToken = generateRefreshToken({ userId: user.id });
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    token: newRefreshToken,
    userId: user.id,
    expiresAt,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
