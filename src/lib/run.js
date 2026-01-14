import { spawn } from "child_process";

export const runNpmScript = async (script, targetDir) =>
  new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", script], {
      stdio: "inherit",
      cwd: targetDir,
      shell: process.platform === "win32",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      const err = new Error("");
      err.exitCode = code ?? 1;
      err.silent = true;
      reject(err);
    });

    child.on("error", () => {
      const err = new Error("Failed to run npm.");
      err.exitCode = 1;
      reject(err);
    });
  });
