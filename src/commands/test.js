import path from "path";
import { ensurePackageJson } from "../lib/validate.js";
import { runNpmScript } from "../lib/run.js";

export const run = async (ctx) => {
  const target = ctx.args[0]
    ? path.resolve(process.cwd(), ctx.args[0])
    : process.cwd();

  await ensurePackageJson(target);
  await runNpmScript("test", target);
};
