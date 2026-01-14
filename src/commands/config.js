import { logInfo } from "../lib/logger.js";
import { getTemplatesRoot, packageRoot } from "../lib/paths.js";

export const run = async () => {
  logInfo(`Package root: ${packageRoot}`);
  logInfo(`Templates path: ${getTemplatesRoot()}`);
};
