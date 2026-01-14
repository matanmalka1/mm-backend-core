import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { userStore } from "../store/userStore.js";

const signAccessToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

const signRefreshToken = (user) =>
  jwt.sign({ sub: user.id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

export const register = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }
  const existing = userStore.users.find((u) => u.email === email);
  if (existing) {
    return res.status(409).json({ message: "user already exists" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: String(userStore.users.length + 1), email, password: hashed };
  userStore.users.push(user);

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  userStore.refreshTokens.add(refreshToken);

  res.status(201).json({ accessToken, refreshToken });
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};
  const user = userStore.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: "invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "invalid credentials" });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  userStore.refreshTokens.add(refreshToken);

  res.status(200).json({ accessToken, refreshToken });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken || !userStore.refreshTokens.has(refreshToken)) {
    return res.status(401).json({ message: "invalid refresh token" });
  }
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    const user = userStore.users.find((u) => u.id === payload.sub);
    if (!user) return res.status(401).json({ message: "user not found" });

    const accessToken = signAccessToken(user);
    return res.status(200).json({ accessToken });
  } catch {
    return res.status(401).json({ message: "invalid refresh token" });
  }
};
