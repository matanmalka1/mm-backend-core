#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const templateDir = path.join(packageRoot, "template");

const args = process.argv.slice(2);
const command = args[0];

const usage = () => {
  console.log(
    [
      "Usage:",
      "  mm-backend-core init <project-name>",
      "",
      "Options:",
      "  -f, --force   Allow non-empty target directory",
      "  -h, --help    Show help",
    ].join("\n")
  );
};

const getFlag = (flag) => args.includes(flag);
const force = getFlag("-f") || getFlag("--force");
const help = getFlag("-h") || getFlag("--help");

if (help || command !== "init") {
  usage();
  process.exit(help ? 0 : 1);
}

const projectName = args[1] || "mm-backend-core-app";
const targetDir = path.resolve(process.cwd(), projectName);

const isDirEmpty = async (dir) => {
  try {
    const entries = await fs.readdir(dir);
    return entries.length === 0;
  } catch {
    return true;
  }
};

const copyRecursive = async (src, dest) => {
  const entries = await fs.readdir(src, { withFileTypes: true });
  await fs.mkdir(dest, { recursive: true });
  await Promise.all(
    entries.map(async (entry) => {
      if (entry.name === "node_modules") return;
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyRecursive(srcPath, destPath);
        return;
      }
      if (entry.isFile()) {
        await fs.copyFile(srcPath, destPath);
      }
    })
  );
};

const renameGitignore = async (dir) => {
  const src = path.join(dir, "_gitignore");
  const dest = path.join(dir, ".gitignore");
  try {
    await fs.rename(src, dest);
  } catch {
    // ignore if _gitignore doesn't exist
  }
};

const updatePackageName = async (dir, name) => {
  const pkgPath = path.join(dir, "package.json");
  try {
    const raw = await fs.readFile(pkgPath, "utf8");
    const pkg = JSON.parse(raw);
    pkg.name = name;
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  } catch {
    // ignore if no package.json
  }
};

const updatePackageLockName = async (dir, name) => {
  const lockPath = path.join(dir, "package-lock.json");
  try {
    const raw = await fs.readFile(lockPath, "utf8");
    const lock = JSON.parse(raw);
    lock.name = name;
    if (lock.packages && lock.packages[""]) {
      lock.packages[""].name = name;
    }
    await fs.writeFile(lockPath, JSON.stringify(lock, null, 2) + "\n");
  } catch {
    // ignore if no package-lock.json
  }
};

const run = async () => {
  if (!force && !(await isDirEmpty(targetDir))) {
    console.error(
      `Target directory is not empty: ${targetDir}\n` +
        "Choose an empty directory, pass --force, or provide a new path."
    );
    process.exit(1);
  }

  await copyRecursive(templateDir, targetDir);
  await renameGitignore(targetDir);
  await updatePackageName(targetDir, projectName);
  await updatePackageLockName(targetDir, projectName);

  console.log(`Template created at ${targetDir}`);
  console.log("");
  console.log("Next steps:");
  console.log(`  cd ${projectName}`);
  console.log("  npm install");
  console.log("  npm run dev");
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
