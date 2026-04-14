import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import type { Config } from "eslint/config";
import tseslint from "typescript-eslint";

const config: Config[] = defineConfig(
  {
    ignores: ["dist/", "node_modules/", "coverage/"],
  },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
);

export default config;
