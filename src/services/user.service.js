import { Role } from "../models/Role.js";
import { User } from "../models/User.js";
import {
  resourceNotFoundError,
  duplicateResourceError,
} from "../utils/error-factories.js";
import {
  parsePaginationParams,
  buildPaginationMeta,
} from "../utils/pagination.js";
import { hashPassword } from "../utils/password.js";

export const createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    throw duplicateResourceError("User", "email");
  }

  if (!userData.password) {
    throw new Error("Password is required for email/password registration");
  }

  const role = await Role.findById(userData.roleId);

  if (!role) {
    throw resourceNotFoundError("Role");
  }

  const user = await User.create({
    email: userData.email,
    password: await hashPassword(userData.password),
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.roleId,
  });

  return user;
};

export const getAllUsers = async (query) => {
  const { page, limit, skip } = parsePaginationParams(query, {
    defaultLimit: 10,
    maxLimit: 100,
  });

  const [users, count] = await Promise.all([
    User.find()
      .populate("role", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(),
  ]);

  return {
    users,
    ...buildPaginationMeta(page, limit, count),
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id)
    .populate({
      path: "role",
      populate: { path: "permissions" },
    })
    .lean();

  if (!user) {
    throw resourceNotFoundError("User", id);
  }

  return user;
};

export const updateUser = async (id, userData) => {
  const user = await User.findById(id);

  if (!user) {
    throw resourceNotFoundError("User");
  }

  if (userData.email && userData.email !== user.email) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw duplicateResourceError("User", "email");
    }
  }

  if (userData.roleId) {
    const role = await Role.findById(userData.roleId);
    if (!role) {
      throw resourceNotFoundError("Role");
    }
    userData.role = userData.roleId;
    delete userData.roleId;
  }

  if (userData.password) {
    userData.password = await hashPassword(userData.password);
  }

  Object.assign(user, userData);
  await user.save();

  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw resourceNotFoundError("User");
  }

  await user.deleteOne();
};
