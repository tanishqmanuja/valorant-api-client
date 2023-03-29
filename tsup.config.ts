import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts", "src/helpers/providers.ts"],
  format: ["esm", "cjs"],
  sourcemap: true,
  outDir: "dist",
});
