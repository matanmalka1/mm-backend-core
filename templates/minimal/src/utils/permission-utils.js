import { Permission } from "../models/Permission.js";

export const ensurePermissions = async (permissions) => {
  const permissionMap = {};

  for (const perm of permissions) {
    let permission = await Permission.findOne({ name: perm.name });
    if (!permission) {
      permission = await Permission.create({
        name: perm.name,
        description: `${perm.name} permission`,
        resource: perm.resource,
        action: perm.action,
      });
    }
    permissionMap[perm.name] = permission;
  }

  return permissionMap;
};
