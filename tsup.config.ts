import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts", "src/types.ts"],
  format: ["esm"],
  sourcemap: true,
  outDir: "dist",
});
