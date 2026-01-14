const importPlugin = require("eslint-plugin-import");
const nPlugin = require("eslint-plugin-n");
const promisePlugin = require("eslint-plugin-promise");

module.exports = [
  {
    ignores: ["node_modules/", "uploads/", "logs/", "dist/"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin,
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...nPlugin.configs.recommended.rules,
      ...promisePlugin.configs.recommended.rules,
      "n/no-missing-import": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "import/no-named-as-default": "off",
      "import/extensions": ["error", "ignorePackages", { js: "always" }],
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "no-console": "off",
    },
  },
  {
    files: ["src/server.js", "src/seed.js"],
    rules: {
      "n/no-process-exit": "off",
    },
  },
  {
    files: ["tests/**/*.js", "vitest.config.js"],
    rules: {
      "n/no-unpublished-import": "off",
      "import/no-unresolved": "off",
    },
  },
];
