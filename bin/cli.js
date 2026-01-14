#!/usr/bin/env node
import { run as runConfig } from "../src/commands/config.js";
import { run as runDoctor } from "../src/commands/doctor.js";
import { run as runInfo } from "../src/commands/info.js";
import { run as runInit } from "../src/commands/init.js";
import { run as runLint } from "../src/commands/lint.js";
import { run as runTest } from "../src/commands/test.js";
import { logError } from "../src/lib/logger.js";
import { readPackageJson } from "../src/lib/paths.js";

const args = process.argv.slice(2);
const command = args[0];

const usage = () => {
  console.log(
    [
      "Usage:",
      "  mm-backend-core init <project-name> [options]",
      "  mm-backend-core info",
      "  mm-backend-core doctor",
      "  mm-backend-core lint [dir]",
      "  mm-backend-core test [dir]",
      "  mm-backend-core config",
      "",
      "Options:",
      "  -f, --force   Allow non-empty target directory",
      "  -h, --help    Show help",
      "  -m, --minimal Use minimal template (no tests/dev extras)",
      "  -v, --version Show version",
    ].join("\n")
  );
};

const hasFlag = (flag) => args.includes(flag);
const options = {
  force: hasFlag("-f") || hasFlag("--force"),
  help: hasFlag("-h") || hasFlag("--help"),
  minimal: hasFlag("-m") || hasFlag("--minimal"),
  version: hasFlag("-v") || hasFlag("--version"),
};

const commandArgs = args.slice(1);
const positionals = commandArgs.filter((arg) => !arg.startsWith("-"));

const commandMap = {
  init: runInit,
  info: runInfo,
  doctor: runDoctor,
  config: runConfig,
  lint: runLint,
  test: runTest,
};

const run = async () => {
  if (options.version) {
    const pkg = await readPackageJson();
    console.log(pkg.version);
    return;
  }

  if (options.help || !command) {
    usage();
    process.exit(options.help ? 0 : 1);
  }

  const handler = commandMap[command];
  if (!handler) {
    usage();
    process.exit(1);
  }

  await handler({ command, args: commandArgs, positionals, options });
};

const handleError = (err) => {
  if (err?.silent) {
    process.exit(err.exitCode ?? 1);
  }
  if (err instanceof Error && err.message) {
    logError(err.message);
  } else if (err) {
    logError(String(err));
  }
  process.exit(err?.exitCode ?? 1);
};

run().catch(handleError);
