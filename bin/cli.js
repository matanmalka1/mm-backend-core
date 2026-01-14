#!/usr/bin/env node
import { run as runConfig } from "../src/commands/config.js";
import { run as runDoctor } from "../src/commands/doctor.js";
import { run as runInfo } from "../src/commands/info.js";
import { run as runInit } from "../src/commands/init.js";
import { run as runLint } from "../src/commands/lint.js";
import { run as runTest } from "../src/commands/test.js";
import { run as runTemplates } from "../src/commands/templates.js";
import { logError } from "../src/lib/logger.js";
import { readPackageJson } from "../src/lib/paths.js";

const args = process.argv.slice(2);
const command = args[0];

const usage = () => {
  console.log(
    [
      "Usage:",
      "  mm-backend-core init <project-name> [options]",
      "  mm-backend-core templates",
      "  mm-backend-core list",
      "  mm-backend-core template <template-name>",
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
      "  -t, --template <name> Use a specific template",
      "  -v, --version Show version",
    ].join("\n")
  );
};

const parseArgs = (argv) => {
  const options = {
    force: false,
    help: false,
    minimal: false,
    template: null,
    version: false,
  };
  const positionals = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") {
      positionals.push(...argv.slice(i + 1));
      break;
    }
    if (arg === "-f" || arg === "--force") {
      options.force = true;
      continue;
    }
    if (arg === "-h" || arg === "--help") {
      options.help = true;
      continue;
    }
    if (arg === "-m" || arg === "--minimal") {
      options.minimal = true;
      continue;
    }
    if (arg === "-v" || arg === "--version") {
      options.version = true;
      continue;
    }
    if (arg === "-t" || arg === "--template") {
      const value = argv[i + 1];
      if (value && !value.startsWith("-")) {
        options.template = value;
        i += 1;
      } else {
        options.template = "";
      }
      continue;
    }
    if (arg.startsWith("--template=")) {
      options.template = arg.split("=").slice(1).join("=");
      continue;
    }
    if (arg.startsWith("-t=")) {
      options.template = arg.slice(3);
      continue;
    }
    if (arg.startsWith("-")) {
      continue;
    }
    positionals.push(arg);
  }

  return { options, positionals };
};

const commandArgs = args.slice(1);
const { options, positionals } = parseArgs(commandArgs);

const commandMap = {
  init: runInit,
  info: runInfo,
  doctor: runDoctor,
  config: runConfig,
  lint: runLint,
  test: runTest,
  templates: runTemplates,
  list: runTemplates,
  template: runTemplates,
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
