import {
  register as registerUser,
  login as loginUser,
} from "../services/auth/core.service.js";
import {
  changePassword as changeUserPassword,
  requestPasswordReset,
  resetPassword as resetUserPassword,
} from "../services/auth/password.service.js";
import { updateProfile as updateUserProfile } from "../services/auth/profile.service.js";
import {
  logout as logoutUser,
  refreshAccessToken,
} from "../services/auth/token.service.js";
import { buildCookieOptions } from "../utils/cookie-options.js";
import { refreshTokenInvalidError } from "../utils/error-factories.js";
import { logger } from "../utils/logger.js";
import { successResponse } from "../utils/response.js";

const cookieOptions = buildCookieOptions();

// Handle registration request.
export const register = async (req, res) => {
  await registerUser(req.body);

  successResponse(res, null, "Check your email");
};

// Handle login request and set refresh token cookie.
export const login = async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await loginUser(email, password);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  successResponse(res, { user, accessToken }, "Login successful");
};

// Handle logout request and clear refresh token cookie.
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  await logoutUser(req.user._id || req.user.id, refreshToken);

  res.clearCookie("refreshToken", cookieOptions);

  successResponse(res, null, "Logout successful");
};

// Handle access token refresh request.
export const refresh = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    throw refreshTokenInvalidError("Refresh token not found");
  }
  const { accessToken, refreshToken } =
    await refreshAccessToken(oldRefreshToken);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  successResponse(res, { accessToken }, "Token refreshed successfully");
};

// Return the authenticated user's profile.
export const me = async (req, res) => {
  successResponse(
    res,
    { user: req.user },
    "User profile retrieved successfully"
  );
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await changeUserPassword(
    req.user._id || req.user.id,
    currentPassword,
    newPassword
  );
  successResponse(res, null, "Password changed successfully");
};

export const updateProfile = async (req, res) => {
  const user = await updateUserProfile(req.user._id || req.user.id, req.body);
  successResponse(res, { user }, "Profile updated successfully");
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const token = await requestPasswordReset(email);

  if (token) {
    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendBase}/reset-password?token=${encodeURIComponent(
      token
    )}`;
    logger.info("Password reset email queued", { email, resetUrl });
  }

  successResponse(
    res,
    null,
    "If an account exists for this email, a reset link has been sent"
  );
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  await resetUserPassword(token, password);
  successResponse(res, null, "Password reset successfully");
};
