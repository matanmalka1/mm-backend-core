import { logInfo } from "../lib/logger.js";
import { getTemplateInfo, listTemplates } from "../lib/templates.js";

const createCliError = (message) => {
  const err = new Error(message);
  err.exitCode = 1;
  return err;
};

const formatTemplateLine = (template) => {
  if (!template.description) return `- ${template.name}`;
  return `- ${template.name}: ${template.description}`;
};

export const run = async (ctx) => {
  const { command, positionals } = ctx;

  if (command === "template") {
    const templateName = positionals[0];
    if (!templateName) {
      throw createCliError("Template name is required: mm-backend-core template <name>");
    }
    const info = await getTemplateInfo(templateName);
    if (!info) {
      const templates = await listTemplates();
      const names = templates.map((t) => t.name);
      const message = names.length
        ? `Unknown template: ${templateName}\nAvailable templates: ${names.join(", ")}`
        : `Unknown template: ${templateName}\nNo templates found.`;
      throw createCliError(message);
    }
    logInfo(`${info.name}`);
    if (info.description) {
      logInfo(info.description);
    }
    return;
  }

  const templates = await listTemplates();
  if (!templates.length) {
    logInfo("No templates found.");
    return;
  }
  templates.forEach((template) => {
    logInfo(formatTemplateLine(template));
  });
};
