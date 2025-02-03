import { resolve } from "path";

import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index"],
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
