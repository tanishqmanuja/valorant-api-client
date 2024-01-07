import { resolve } from "path";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index", "./src/types.ts", "./src/default-configs.ts"],
  outDir: "dist",
  declaration: true,
  alias: {
    "~": resolve(__dirname, "./src"),
  },
  failOnWarn: false,
});
