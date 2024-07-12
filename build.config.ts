import { resolve } from "path";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index", "./src/types.ts", "./src/presets.ts"],
  outDir: "dist",
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  alias: {
    "~": resolve(__dirname, "./src"),
  },
  failOnWarn: false,
});
