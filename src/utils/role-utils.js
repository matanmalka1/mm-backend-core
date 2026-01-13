import { Role } from "../models/Role.js";

export const ensureDefaultUserRole = async () => {
  let role = await Role.findOne({ name: "user" });
  if (!role) {
    role = await Role.create({ name: "user", description: "user role" });
  }
  return role;
};
