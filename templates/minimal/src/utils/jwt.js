import crypto from "node:crypto";

import jwt from "jsonwebtoken";

import {
  tokenExpiredError,
  invalidTokenError,
  refreshTokenExpiredError,
  refreshTokenInvalidError,
} from "../utils/error-factories.js";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload) => {
  const tokenPayload = {
    ...payload,
    jti: crypto.randomUUID(),
  };

  return jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw tokenExpiredError("Access token expired");
    }
    throw invalidTokenError("Invalid access token");
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw refreshTokenExpiredError("Refresh token expired");
    }
    throw refreshTokenInvalidError("Invalid refresh token");
  }
};
