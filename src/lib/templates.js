import fs from "fs/promises";
import path from "path";
import { getTemplatePath, getTemplatesRoot } from "./paths.js";

const readTemplateJsonDescription = async (templateDir) => {
  const metaPath = path.join(templateDir, "template.json");
  try {
    const raw = await fs.readFile(metaPath, "utf8");
    const meta = JSON.parse(raw);
    if (typeof meta.description === "string" && meta.description.trim()) {
      return meta.description.trim();
    }
  } catch {
    // ignore missing/invalid template.json
  }
  return null;
};

const readReadmeDescription = async (templateDir) => {
  const readmePath = path.join(templateDir, "readme.md");
  try {
    const raw = await fs.readFile(readmePath, "utf8");
    const line = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l.length > 0);
    if (!line) return null;
    return line.replace(/^#+\s*/, "");
  } catch {
    // ignore missing readme
  }
  return null;
};

const readTemplateDescription = async (templateDir) => {
  const fromMeta = await readTemplateJsonDescription(templateDir);
  if (fromMeta) return fromMeta;
  return readReadmeDescription(templateDir);
};

export const listTemplates = async () => {
  const root = getTemplatesRoot();
  let entries;
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch {
    return [];
  }

  const templates = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const templateDir = path.join(root, entry.name);
        const description = await readTemplateDescription(templateDir);
        return {
          name: entry.name,
          description: description || "",
          path: templateDir,
        };
      })
  );

  return templates.sort((a, b) => a.name.localeCompare(b.name));
};

export const getTemplateInfo = async (templateName) => {
  const templateDir = getTemplatePath(templateName);
  try {
    const stat = await fs.stat(templateDir);
    if (!stat.isDirectory()) return null;
  } catch {
    return null;
  }
  const description = await readTemplateDescription(templateDir);
  return {
    name: templateName,
    description: description || "",
    path: templateDir,
  };
};
