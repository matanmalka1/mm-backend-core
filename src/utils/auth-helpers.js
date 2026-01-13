import crypto from "node:crypto";

import { User } from "../models/User.js";

import { getRefreshTokenTtlMs } from "./duration.js";
import { verifyAccessToken } from "./jwt.js";

export const hashRefreshToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const getRefreshTokenExpiration = () => {
  const expiresAt = new Date();
  expiresAt.setTime(expiresAt.getTime() + getRefreshTokenTtlMs());
  return expiresAt;
};

export const sanitizeUser = (user) => {
  if (!user) return user;
  const userObject =
    typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete userObject.password;
  return userObject;
};

export const getUserFromToken = async (authHeader, options = {}) => {
  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    const query = User.findById(decoded.userId);

    if (options.includePermissions) {
      query.populate({
        path: "role",
        populate: { path: "permissions" },
      });
    } else {
      query.populate("role", "name");
    }

    const user = await query.lean();
    if (!user || !user.isActive) return null;

    return user;
  } catch {
    return null;
  }
};
