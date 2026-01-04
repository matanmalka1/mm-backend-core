import * as authService from "../services/auth.service.js";
import { successResponse } from "../utils/response.js";
import { ApiError, API_ERROR_CODES } from "../constants/api-error-codes.js";

export const register = async (req, res, next) => {
  try {
    const { user } = await authService.register(req.body);

    successResponse(res, { user }, "User registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE,
      sameSite: process.env.COOKIE_SAME_SITE,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    successResponse(res, { user, accessToken }, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await authService.logout(req.user.id, refreshToken);

    res.clearCookie("refreshToken");

    successResponse(res, null, "Logout successful");
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      throw new ApiError(
        API_ERROR_CODES.REFRESH_TOKEN_INVALID,
        "Refresh token not found",
        401
      );
    }

    const { accessToken, refreshToken } =
      await authService.refreshAccessToken(oldRefreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE,
      sameSite: process.env.COOKIE_SAME_SITE,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    successResponse(res, { accessToken }, "Token refreshed successfully");
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    successResponse(
      res,
      { user: req.user },
      "User profile retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};
