import fs from "fs/promises";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const templatesRoot = path.join(repoRoot, "templates");

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const ensureTemplateDescriptions = async () => {
  const entries = await fs.readdir(templatesRoot, { withFileTypes: true });
  const dirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  for (const name of dirs) {
    const metaPath = path.join(templatesRoot, name, "template.json");
    let raw;
    try {
      raw = await fs.readFile(metaPath, "utf8");
    } catch {
      throw new Error(`Missing template.json for ${name}`);
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error(`Invalid JSON in ${metaPath}`);
    }

    const desc = data.description;
    assert(typeof desc === "string" && desc.trim().length > 0, `Missing description in ${metaPath}`);
  }
};

const runInitSmoke = async () => {
  const tmpRoot = path.join(repoRoot, ".tmp");
  const projectDir = path.join(tmpRoot, "smoke-init-test");
  const cliPath = path.join(repoRoot, "bin", "cli.js");

  await fs.mkdir(tmpRoot, { recursive: true });
  await fs.rm(projectDir, { recursive: true, force: true });

  const result = spawnSync(
    process.execPath,
    [cliPath, "init", "smoke-init-test", "--template", "minimal", "--force"],
    {
      cwd: tmpRoot,
      stdio: "inherit",
    }
  );

  if (result.status !== 0) {
    throw new Error(`Init smoke failed with exit code ${result.status ?? "unknown"}`);
  }

  const pkgPath = path.join(projectDir, "package.json");
  const envExamplePath = path.join(projectDir, ".env.example");
  await fs.access(pkgPath);
  await fs.access(envExamplePath);

  await fs.rm(projectDir, { recursive: true, force: true });
};

const main = async () => {
  await ensureTemplateDescriptions();
  await runInitSmoke();
};

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
