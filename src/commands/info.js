import { logInfo } from "../lib/logger.js";
import { readPackageJson } from "../lib/paths.js";

export const run = async () => {
  const pkg = await readPackageJson();
  logInfo(`Name: ${pkg.name}`);
  logInfo(`Version: ${pkg.version}`);
  logInfo(`Node: ${pkg.engines?.node || "unspecified"}`);
  logInfo(`Repository: ${pkg.repository?.url || "unspecified"}`);
};
