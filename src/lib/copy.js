import fs from "fs/promises";
import path from "path";

const normalizeRelativePath = (relPath) => relPath.split(path.sep).join("/");

export const copyDir = async (src, dest, options = {}) => {
  const { filter, baseDir = src } = options;
  const entries = await fs.readdir(src, { withFileTypes: true });
  await fs.mkdir(dest, { recursive: true });

  await Promise.all(
    entries.map(async (entry) => {
      if (entry.name === "node_modules") return;
      const srcPath = path.join(src, entry.name);
      const relPath = normalizeRelativePath(path.relative(baseDir, srcPath));
      if (filter && !filter(relPath, entry)) return;

      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath, options);
        return;
      }
      if (entry.isFile()) {
        await fs.copyFile(srcPath, destPath);
      }
    })
  );
};
