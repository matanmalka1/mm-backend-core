import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const packageRoot = path.resolve(__dirname, "..", "..");
export const getTemplatesRoot = () => path.join(packageRoot, "templates");

export const getTemplatePath = (templateName) =>
  path.join(getTemplatesRoot(), templateName);

export const readPackageJson = async () => {
  const pkgPath = path.join(packageRoot, "package.json");
  const raw = await fs.readFile(pkgPath, "utf8");
  return JSON.parse(raw);
};
