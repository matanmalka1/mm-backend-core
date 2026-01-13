import { RefreshToken } from "../../models/RefreshToken.js";
import { User } from "../../models/User.js";
import {
  hashRefreshToken,
  getRefreshTokenExpiration,
  sanitizeUser,
} from "../../utils/auth-helpers.js";
import { invalidCredentialsError } from "../../utils/error-factories.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { logger } from "../../utils/logger.js";
import {
  comparePassword,
  hashPassword,
  DUMMY_PASSWORD_HASH,
} from "../../utils/password.js";
import { ensureDefaultUserRole } from "../../utils/role-utils.js";

export const register = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    await hashPassword(userData.password || "placeholder");
    logger.warn("Registration failed - duplicate email", {
      email: userData.email,
    });
    return { user: null, created: false };
  }

  const defaultRole = await ensureDefaultUserRole();

  const user = await User.create({
    email: userData.email,
    password: await hashPassword(userData.password),
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: defaultRole._id,
  });

  const userObject = sanitizeUser(user);

  logger.info("User registered successfully", {
    userId: user._id,
    email: user.email,
  });

  return { user: userObject, created: true };
};

export const login = async (email, password) => {
  const user = await User.findOne({ email })
    .select("+password")
    .populate({
      path: "role",
      populate: { path: "permissions" },
    });

  if (!user) {
    await comparePassword(password, DUMMY_PASSWORD_HASH);
    logger.warn("Login failed - invalid credentials", { email });
    throw invalidCredentialsError("Invalid email or password");
  }

  if (!user.isActive) {
    await comparePassword(password, user.password);
    logger.warn("Login failed - invalid credentials", { email });
    throw invalidCredentialsError("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    logger.warn("Login failed - invalid credentials", { email });
    throw invalidCredentialsError("Invalid email or password");
  }

  const accessToken = generateAccessToken({ userId: user._id.toString() });
  const refreshToken = generateRefreshToken({ userId: user._id.toString() });
  const expiresAt = getRefreshTokenExpiration();
  const tokenHash = hashRefreshToken(refreshToken);

  await RefreshToken.create({
    token: tokenHash,
    user: user._id,
    expiresAt,
  });

  await user.updateOne({ lastLogin: new Date() });

  const userObject = sanitizeUser(user);

  logger.info("User logged in successfully", {
    userId: user._id,
    email: user.email,
  });

  return { user: userObject, accessToken, refreshToken };
};

export const handleOAuthLogin = async (user) => {
  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
  });
  const refreshToken = generateRefreshToken({ userId: user._id.toString() });

  const tokenHash = hashRefreshToken(refreshToken);
  await RefreshToken.create({
    token: tokenHash,
    user: user._id,
    expiresAt: getRefreshTokenExpiration(),
  });

  logger.info("OAuth login successful", {
    userId: user._id,
    email: user.email,
  });

  return { accessToken, refreshToken };
};
