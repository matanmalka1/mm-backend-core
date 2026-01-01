import bcrypt from "bcrypt";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { sequelize } from "./config/db.js";
import { User, Role, Permission } from "./models/associations.js";

const envFile =
  process.env.NODE_ENV && process.env.NODE_ENV !== "production"
    ? `.env.${process.env.NODE_ENV}`
    : ".env";

const cwd = process.cwd();
const preferredDevEnv = path.join(cwd, ".env.development");
const envPath = path.join(cwd, envFile);

if (!process.env.NODE_ENV && fs.existsSync(preferredDevEnv)) {
  dotenv.config({ path: preferredDevEnv });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const seed = async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  const roleNames = ["admin", "manager", "editor", "support", "user"];
  const roleMap = {};

  for (const name of roleNames) {
    const [role] = await Role.findOrCreate({
      where: { name },
      defaults: { description: `${name} role` },
    });
    roleMap[name] = role;
  }

  const permissions = [
    { name: "users.read", resource: "users", action: "read" },
    { name: "users.create", resource: "users", action: "create" },
    { name: "users.update", resource: "users", action: "update" },
    { name: "users.delete", resource: "users", action: "delete" },
    { name: "roles.read", resource: "roles", action: "read" },
    { name: "roles.update", resource: "roles", action: "update" },
    { name: "upload.create", resource: "upload", action: "create" },
    { name: "health.read", resource: "health", action: "read" },
    { name: "auth.refresh", resource: "auth", action: "refresh" },
    { name: "auth.logout", resource: "auth", action: "logout" },
  ];

  for (const permission of permissions) {
    await Permission.findOrCreate({
      where: { name: permission.name },
      defaults: {
        description: `${permission.name} permission`,
        resource: permission.resource,
        action: permission.action,
      },
    });
  }

  const permissionRecords = await Permission.findAll();
  const permissionByName = new Map(
    permissionRecords.map((permission) => [permission.name, permission])
  );

  const adminPermissions = permissionRecords;
  const managerPermissions = [
    "users.read",
    "users.create",
    "users.update",
    "roles.read",
    "upload.create",
    "health.read",
  ].map((name) => permissionByName.get(name));
  const editorPermissions = ["users.read", "users.update", "upload.create"].map(
    (name) => permissionByName.get(name)
  );
  const supportPermissions = ["users.read", "health.read"].map((name) =>
    permissionByName.get(name)
  );
  const userPermissions = ["health.read", "auth.refresh", "auth.logout"].map(
    (name) => permissionByName.get(name)
  );

  await roleMap.admin.setPermissions(adminPermissions);
  await roleMap.manager.setPermissions(managerPermissions);
  await roleMap.editor.setPermissions(editorPermissions);
  await roleMap.support.setPermissions(supportPermissions);
  await roleMap.user.setPermissions(userPermissions);

  const usersToSeed = [
    { email: "admin@example.com", first: "Admin", last: "User", role: "admin" },
    { email: "manager@example.com", first: "Manager", last: "User", role: "manager" },
    { email: "editor@example.com", first: "Editor", last: "User", role: "editor" },
    { email: "support@example.com", first: "Support", last: "User", role: "support" },
    { email: "user1@example.com", first: "User", last: "One", role: "user" },
    { email: "user2@example.com", first: "User", last: "Two", role: "user" },
    { email: "user3@example.com", first: "User", last: "Three", role: "user" },
    { email: "user4@example.com", first: "User", last: "Four", role: "user" },
    { email: "user5@example.com", first: "User", last: "Five", role: "user" },
    { email: "user6@example.com", first: "User", last: "Six", role: "user" },
  ];

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  for (const user of usersToSeed) {
    const existing = await User.findOne({ where: { email: user.email } });
    if (existing) {
      continue;
    }
    await User.create({
      email: user.email,
      password: hashedPassword,
      firstName: user.first,
      lastName: user.last,
      roleId: roleMap[user.role].id,
      isActive: true,
    });
  }

  await sequelize.close();
};

seed().catch(() => {
  process.exit(1);
});
