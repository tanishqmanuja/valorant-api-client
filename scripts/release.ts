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

console.log(`⬆️ Bump Version`);
execSync(`pnpm version ${version} -m "chore: release %s"`, {
  stdio: "inherit",
});
process.stdout.write("\n");

console.log(`🫸🏻 Push Tag`);
execSync(`git push --follow-tags`, { stdio: "inherit" });
process.stdout.write("\n");
