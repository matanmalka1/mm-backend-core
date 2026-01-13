import "./config/env.js";
import bcrypt from "bcrypt";

import { connectDB, disconnectDB } from "./config/db.js";
import { User, Role, Permission } from "./models/index.js";

// Seed database with roles, permissions, and default users.
const seed = async () => {
  await connectDB();

  console.log("Starting database seed...");

  // Create Roles
  const roleNames = ["admin", "manager", "editor", "support", "user"];
  const roleMap = {};

  for (const name of roleNames) {
    let role = await Role.findOne({ name });
    if (!role) {
      role = await Role.create({
        name,
        description: `${name} role`,
      });
    }
    roleMap[name] = role;
  }

  console.log("Roles created/updated");

  // Create Permissions
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

  console.log("Permissions created/updated");

  // Assign permissions to roles
  const allPermissions = Object.values(permissionMap).map((p) => p._id);

  roleMap.admin.permissions = allPermissions;
  await roleMap.admin.save();

  roleMap.manager.permissions = [
    "users.read",
    "users.create",
    "users.update",
    "roles.read",
    "upload.create",
    "health.read",
  ].map((name) => permissionMap[name]._id);
  await roleMap.manager.save();

  roleMap.editor.permissions = [
    "users.read",
    "users.update",
    "upload.create",
  ].map((name) => permissionMap[name]._id);
  await roleMap.editor.save();

  roleMap.support.permissions = ["users.read", "health.read"].map(
    (name) => permissionMap[name]._id
  );
  await roleMap.support.save();

  roleMap.user.permissions = ["health.read", "auth.refresh", "auth.logout"].map(
    (name) => permissionMap[name]._id
  );
  await roleMap.user.save();

  console.log("Permissions assigned to roles");

  // Create Users
  const usersToSeed = [
    { email: "admin@example.com", first: "Admin", last: "User", role: "admin" },
    {
      email: "manager@example.com",
      first: "Manager",
      last: "User",
      role: "manager",
    },
    {
      email: "editor@example.com",
      first: "Editor",
      last: "User",
      role: "editor",
    },
    {
      email: "support@example.com",
      first: "Support",
      last: "User",
      role: "support",
    },
    { email: "user1@example.com", first: "User", last: "One", role: "user" },
    { email: "user2@example.com", first: "User", last: "Two", role: "user" },
    { email: "user3@example.com", first: "User", last: "Three", role: "user" },
    { email: "user4@example.com", first: "User", last: "Four", role: "user" },
    { email: "user5@example.com", first: "User", last: "Five", role: "user" },
    { email: "user6@example.com", first: "User", last: "Six", role: "user" },
  ];

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  for (const user of usersToSeed) {
    const existing = await User.findOne({ email: user.email });
    if (!existing) {
      await User.create({
        email: user.email,
        password: hashedPassword,
        firstName: user.first,
        lastName: user.last,
        role: roleMap[user.role]._id,
        isActive: true,
      });
    }
  }

  console.log("Users created");
  console.log("Database seeded successfully!");

  await disconnectDB();
  process.exit(0);
};

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
