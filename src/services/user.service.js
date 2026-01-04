import { User, Role, Permission } from "../models/associations.js";
import { ApiError, API_ERROR_CODES } from "../constants/api-error-codes.js";
import { hashPassword } from "../utils/password.js";

// CREATE
export const createUser = async (userData) => {
  const existingUser = await User.findOne({ where: { email: userData.email } });

  if (existingUser) {
    throw new ApiError(
      API_ERROR_CODES.DUPLICATE_RESOURCE,
      "User with this email already exists",
      400
    );
  }

  const role = await Role.findByPk(userData.roleId);

  if (!role) {
    throw new ApiError(
      API_ERROR_CODES.RESOURCE_NOT_FOUND,
      "Role not found",
      404
    );
  }

  const user = await User.create({
    email: userData.email,
    password: await hashPassword(userData.password),
    firstName: userData.firstName,
    lastName: userData.lastName,
    roleId: userData.roleId,
  });

  return user;
};
// READ ALL
export const getAllUsers = async (query) => {
  const { count, rows } = await User.findAndCountAll({
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return { count, users: rows };
};

// READ
export const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: [
      {
        model: Role,
        as: "role",
        include: [{ model: Permission, as: "permissions" }],
      },
    ],
  });

  if (!user) {
    throw new ApiError(
      API_ERROR_CODES.RESOURCE_NOT_FOUND,
      `User with id ${id} not found`,
      404
    );
  }

  return user;
};

// UPDATE
export const updateUser = async (id, userData) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new ApiError(
      API_ERROR_CODES.RESOURCE_NOT_FOUND,
      "User not found",
      404
    );
  }

  if (userData.email && userData.email !== user.email) {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new ApiError(
        API_ERROR_CODES.DUPLICATE_RESOURCE,
        "User with this email already exists",
        400
      );
    }
  }

  if (userData.roleId) {
    const role = await Role.findByPk(userData.roleId);
    if (!role) {
      throw new ApiError(
        API_ERROR_CODES.RESOURCE_NOT_FOUND,
        "Role not found",
        404
      );
    }
  }

  await user.update({
    ...(userData.email && { email: userData.email }),
    ...(userData.firstName && { firstName: userData.firstName }),
    ...(userData.lastName && { lastName: userData.lastName }),
    ...(userData.isActive !== undefined && { isActive: userData.isActive }),
    ...(userData.roleId && { roleId: userData.roleId }),
  });

  return user;
};

// DELETE
export const deleteUser = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new ApiError(
      API_ERROR_CODES.RESOURCE_NOT_FOUND,
      "User not found",
      404
    );
  }

  await user.destroy();
};
