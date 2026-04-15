import type { ViteUserConfig } from "vitest/config";
import { defineConfig } from "vitest/config";

const config: ViteUserConfig = defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    coverage: { enabled: true, thresholds: { 100: true } },
    testTimeout: 500,
    alias: { $dist: "./dist" },
  },
});

export default config;
