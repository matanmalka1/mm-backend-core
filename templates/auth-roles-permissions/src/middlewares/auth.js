import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { userStore } from "../store/userStore.js";

export const auth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "missing token" });
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = userStore.users.find((u) => u.id === payload.sub);
    if (!user) return res.status(401).json({ message: "invalid token" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "invalid token" });
  }
};
