import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginCypress from "eslint-plugin-cypress";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/build/**",
      "**/.git/**",
      "**/.vscode/**",
      "**/.github/**",
      "**/cypress/**"
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        module: true,
        process: true,
        React: true
      }
    }
  },
  {
    plugins: {
      react: pluginReact,
      cypress: pluginCypress
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginCypress.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed with React 17+
      "react/display-name": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];