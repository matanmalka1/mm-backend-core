import {
  authenticationError,
  authorizationError,
} from "../utils/error-factories.js";
import { getUserFromToken } from "../utils/auth-helpers.js";

// Authenticate request by validating JWT and loading user with role/permissions.
export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw authenticationError("No token provided");
    }

    const user = await getUserFromToken(authHeader, {
      includePermissions: true,
    });
    if (!user) {
      throw authenticationError("Invalid token");
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
