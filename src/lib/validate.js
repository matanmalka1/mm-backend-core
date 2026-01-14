import fs from "fs/promises";
import path from "path";

export const isDirEmpty = async (dir) => {
  try {
    const entries = await fs.readdir(dir);
    return entries.length === 0;
  } catch {
    return true;
  }
};

const isValidPackageSegment = (segment) =>
  /^[a-z0-9][a-z0-9-._]*$/.test(segment);

export const isValidPackageName = (name) => {
  if (!name || typeof name !== "string") return false;
  if (name.startsWith("@")) {
    const [scope, pkg] = name.split("/");
    if (!scope || !pkg) return false;
    return (
      isValidPackageSegment(scope.slice(1)) && isValidPackageSegment(pkg)
    );
  }
  return isValidPackageSegment(name);
};

export const ensurePackageJson = async (dir) => {
  const pkgPath = path.join(dir, "package.json");
  try {
    await fs.access(pkgPath);
  } catch {
    const err = new Error(`No package.json found in ${dir}`);
    err.exitCode = 1;
    throw err;
  }
};
