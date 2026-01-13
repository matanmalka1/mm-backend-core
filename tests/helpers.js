import request from "supertest";

import { app } from "../src/app.js";
import { User } from "../src/models/index.js";
import { hashPassword } from "../src/utils/password.js";

export const createUser = async ({
  email,
  password,
  roleId,
  firstName = "Test",
  lastName = "User",
  isActive = true,
} = {}) => {
  const hashedPassword = await hashPassword(password);
  return User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role: roleId,
    isActive,
  });
};

export const loginAndGetTokens = async (email, password) => {
  const res = await request(app).post("/api/v1/auth/login").send({
    email,
    password,
  });

  const accessToken = res.body?.data?.accessToken;
  const cookies = res.headers["set-cookie"] || [];
  const refreshCookie = cookies.find((cookie) =>
    cookie.startsWith("refreshToken=")
  );

  return { accessToken, refreshCookie, res };
};
