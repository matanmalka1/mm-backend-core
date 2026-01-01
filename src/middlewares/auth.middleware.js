import { verifyAccessToken } from "../utils/jwt.js";
import { ApiError, API_ERROR_CODES } from "../constants/api-error-codes.js";
import { User, Role, Permission } from "../models/associations.js";

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        API_ERROR_CODES.AUTHENTICATION_ERROR,
        "No token provided",
        401
      );
    }
    const decoded = verifyAccessToken(authHeader.substring(7));

    const user = await User.findByPk(decoded.userId, {
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
        API_ERROR_CODES.AUTHENTICATION_ERROR,
        "User not found or inactive",
        401
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return async (req, _res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(
          API_ERROR_CODES.AUTHORIZATION_ERROR,
          "User not authenticated",
          403
        );
      }

      const userRole = req.user.role.name;

      if (!roles.includes(userRole)) {
        throw new ApiError(
          API_ERROR_CODES.AUTHORIZATION_ERROR,
          "Insufficient permissions",
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkPermission = (resource, action) => {
  return async (req, _res, next) => {
    try {
      if (!req.user || !req.user.role) {
        throw new ApiError(
          API_ERROR_CODES.AUTHORIZATION_ERROR,
          "User not authenticated",
          403
        );
      }

      const hasPermission = req.user.role.permissions.some(
        (permission) =>
          permission.resource === resource && permission.action === action
      );

      if (!hasPermission) {
        throw new ApiError(
          API_ERROR_CODES.AUTHORIZATION_ERROR,
          `Permission denied: ${action} on ${resource}`,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
