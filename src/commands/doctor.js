import fs from "fs/promises";
import { execFile } from "child_process";
import { logInfo } from "../lib/logger.js";
import { readPackageJson } from "../lib/paths.js";

export const run = async () => {
  const pkg = await readPackageJson();
  const required = pkg.engines?.node || ">=18.0.0";
  const nodeVersion = process.version;
  const nodeOk = parseInt(nodeVersion.replace(/^v/, ""), 10) >= 18;

  logInfo(`Node version: ${nodeVersion} (${nodeOk ? "ok" : "upgrade"})`);
  logInfo(`Required: ${required}`);

  await new Promise((resolve) => {
    execFile("npm", ["-v"], (err, stdout) => {
      if (err) {
        logInfo("npm: not found");
        resolve();
        return;
      }
      logInfo(`npm: ${stdout.trim()}`);
      resolve();
    });
  });

  try {
    await fs.access(process.cwd());
    logInfo("Workspace: writable");
  } catch {
    logInfo("Workspace: not writable");
  }
};
