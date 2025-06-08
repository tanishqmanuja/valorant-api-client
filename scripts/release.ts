import { execSync } from "child_process";
import { parseArgs } from "util";

const { positionals } = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
});

const version = positionals[0];

if (!version) {
  throw new Error("version is required");
}

execSync(`pnpm version ${version} -m "chore: release %s"`, {
  stdio: "inherit",
});
execSync(`git push --follow-tags`, { stdio: "inherit" });
