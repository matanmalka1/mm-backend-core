import jwt from 'jsonwebtoken';

import { ApiError, API_ERROR_CODES } from '../constants/api-error-codes.js';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token,  process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(API_ERROR_CODES.TOKEN_EXPIRED, 'Access token expired', 401);
    }
    throw new ApiError(API_ERROR_CODES.INVALID_TOKEN, 'Invalid access token', 401);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(API_ERROR_CODES.REFRESH_TOKEN_EXPIRED, 'Refresh token expired', 401);
    }
    throw new ApiError(API_ERROR_CODES.REFRESH_TOKEN_INVALID, 'Invalid refresh token', 401);
  }
};
