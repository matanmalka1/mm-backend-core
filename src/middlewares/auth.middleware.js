import { User } from "../models/index.js";
import {
  authenticationError,
  authorizationError,
} from "../utils/error-factories.js";
import { verifyAccessToken } from "../utils/jwt.js";

// Authenticate request by validating JWT and loading user with role/permissions.
export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw authenticationError("No token provided");
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId)
      .populate({
        path: "role",
        populate: { path: "permissions" },
      })
      .lean();

    if (!user || !user.isActive) {
      throw authenticationError("User not found or inactive");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Check authenticated user's role against allowed roles.
export const authorize = (...roles) => {
  return async (req, _res, next) => {
    try {
      if (!req.user) {
        throw authorizationError("User not authenticated");
      }

      const userRole = req.user.role.name;

      if (!roles.includes(userRole)) {
        throw authorizationError("Insufficient permissions");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Check authenticated user's permissions for a resource/action pair.
export const checkPermission = (resource, action) => {
  return async (req, _res, next) => {
    try {
      if (!req.user || !req.user.role) {
        throw authorizationError("User not authenticated");
      }

      const hasPermission = req.user.role.permissions.some(
        (permission) =>
          permission.resource === resource && permission.action === action
      );

      if (!hasPermission) {
        throw authorizationError(`Permission denied: ${action} on ${resource}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
