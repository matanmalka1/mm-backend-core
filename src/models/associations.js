import { User } from "./User.js";
import { Role } from "./Role.js";
import { Permission } from "./Permission.js";
import { RefreshToken } from "./RefreshToken.js";

User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });

Role.hasMany(User, { foreignKey: "roleId", as: "users" });

Role.belongsToMany(Permission, {
  through: "role_permissions",
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: "role_permissions",
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

export { User, Role, Permission, RefreshToken };
