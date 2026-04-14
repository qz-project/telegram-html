import type { UserConfig } from "tsdown";
import { defineConfig } from "tsdown";

const Config: UserConfig = defineConfig({
  exports: true,
  failOnWarn: true,
  platform: "neutral",
  target: "es2024",
  unbundle: true,
  unused: {
    enabled: true,
    ignore: { dependencies: ["@types/hast"] },
  },
});

export default Config;
