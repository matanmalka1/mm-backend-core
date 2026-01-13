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
];
