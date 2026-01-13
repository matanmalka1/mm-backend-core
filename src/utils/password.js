import bcrypt from "bcrypt";

// Generated once at startup for timing-safe comparisons when no user is found.
export const DUMMY_PASSWORD_HASH = bcrypt.hashSync("dummy-password", 10);

// Hash a plaintext password with bcrypt.
export const hashPassword = async (password) => bcrypt.hash(password, 10);

// Compare a plaintext password with a bcrypt hash.
export const comparePassword = async (plainPassword, hashedPassword) =>
  bcrypt.compare(plainPassword, hashedPassword);
