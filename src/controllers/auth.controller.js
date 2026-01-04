import * as authService from "../services/auth.service.js";
import { successResponse } from "../utils/response.js";
import { ApiError, API_ERROR_CODES } from "../constants/api-error-codes.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Handle registration request.
export const register = asyncHandler(async (req, res) => {
  const { user } = await authService.register(req.body);

  successResponse(res, { user }, "User registered successfully", 201);
});

// Handle login request and set refresh token cookie.
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(
    email,
    password
  );

  res.cookie("refreshToken", refreshToken, cookieOptions);

  successResponse(res, { user, accessToken }, "Login successful");
});

// Handle logout request and clear refresh token cookie.
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  await authService.logout(req.user.id, refreshToken);

  res.clearCookie("refreshToken");

  successResponse(res, null, "Logout successful");
});

// Handle access token refresh request.
export const refresh = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    throw new ApiError(
      API_ERROR_CODES.REFRESH_TOKEN_INVALID,
      "Refresh token not found",
      401
    );
  }

  const { accessToken, refreshToken } = await authService.refreshAccessToken(
    oldRefreshToken
  );

  res.cookie("refreshToken", refreshToken, cookieOptions);

  successResponse(res, { accessToken }, "Token refreshed successfully");
});

// Return the authenticated user's profile.
export const me = asyncHandler(async (req, res) => {
  successResponse(
    res,
    { user: req.user },
    "User profile retrieved successfully"
  );
});
