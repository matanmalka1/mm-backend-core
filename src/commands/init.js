import fs from "fs/promises";
import path from "path";
import { copyDir } from "../lib/copy.js";
import { logInfo, logWarn } from "../lib/logger.js";
import { getTemplatePath, getTemplatesRoot } from "../lib/paths.js";
import { listTemplates } from "../lib/templates.js";
import { isDirEmpty, isValidPackageName } from "../lib/validate.js";

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

const ensureDotEnv = async (dir) => {
  const src = path.join(dir, ".env.example");
  const dest = path.join(dir, ".env");
  try {
    await fs.access(dest);
    return;
  } catch {
    // only copy if .env doesn't exist
  }
  try {
    await fs.copyFile(src, dest);
  } catch {
    // ignore if no .env.example
  }
};

const createCliError = (message) => {
  const err = new Error(message);
  err.exitCode = 1;
  return err;
};

const resolveTemplateName = (options) => {
  if (options.template === "") {
    throw createCliError("Missing template name. Use --template <name>.");
  }
  if (options.template) return options.template;
  if (options.minimal) return "minimal";
  return "full";
};

const formatTemplateList = (templates) => {
  if (!templates.length) return "No templates found.";
  return `Available templates: ${templates.map((t) => t.name).join(", ")}`;
};

export const run = async (ctx) => {
  const { positionals, options } = ctx;
  const projectName = positionals[0] || "mm-backend-core-app";
  const targetDir =
    projectName === "."
      ? process.cwd()
      : path.resolve(process.cwd(), projectName);
  const resolvedProjectName =
    projectName === "." ? path.basename(targetDir) : projectName;

  const templatesRoot = getTemplatesRoot();
  try {
    await fs.access(templatesRoot);
  } catch {
    throw createCliError(`Templates directory not found: ${templatesRoot}`);
  }

  if (!isValidPackageName(resolvedProjectName)) {
    throw createCliError(
      `Invalid project name: ${resolvedProjectName}\n` +
        "Use lowercase letters, numbers, dots, underscores, and dashes."
    );
  }

  if (!options.force && !(await isDirEmpty(targetDir))) {
    throw createCliError(
      `Target directory is not empty: ${targetDir}\n` +
        "Choose an empty directory, pass --force, or provide a new path."
    );
  }

  if (options.force && !(await isDirEmpty(targetDir))) {
    logWarn("Warning: --force enabled. Existing files may be overwritten.");
  }

  if (options.minimal && options.template) {
    logWarn("Warning: --minimal ignored because --template is set.");
  }

  const templateName = resolveTemplateName(options);
  const templatePath = getTemplatePath(templateName);
  try {
    const stat = await fs.stat(templatePath);
    if (!stat.isDirectory()) throw new Error("Not a directory");
  } catch {
    const templates = await listTemplates();
    throw createCliError(
      `Unknown template: ${templateName}\n${formatTemplateList(templates)}`
    );
  }

  await copyDir(templatePath, targetDir, { baseDir: templatePath });
  await renameGitignore(targetDir);
  await updatePackageName(targetDir, resolvedProjectName);
  await updatePackageLockName(targetDir, resolvedProjectName);
  await ensureDotEnv(targetDir);

  logInfo(`Template created at ${targetDir}`);
  logInfo("");
  logInfo("Next steps:");
  if (projectName !== ".") {
    logInfo(`  cd ${projectName}`);
  }
  logInfo("  npm install");
  logInfo("  npm run dev");
};
