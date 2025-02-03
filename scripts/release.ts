import { parseArgs } from "util";

import { $ } from "bun";

import { version } from "../package.json";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    dry: {
      type: "boolean",
      default: false,
    },
    workflow: {
      type: "string",
      default: "release.yaml",
    },
  },
  strict: true,
  allowPositionals: true,
});

const bump = positionals[2] ?? "patch";
const workflowId = values.workflow ?? "release.yaml";
const isDryRun = values.dry;

if (!bump) {
  console.error("Missing bump");
  process.exit(1);
}

const BUMP_TYPES = ["major", "minor", "patch"];
if (!BUMP_TYPES.includes(bump)) {
  console.error("Invalid bump");
  process.exit(1);
}

const { owner, repo } = await $`git config --get remote.origin.url`
  .quiet()
  .text()
  .then((url) => {
    const [owner, repo] = url
      .trim()
      .replace(/^.*github\.com(\:|\/)?/, "")
      .replace(".git", "")
      .split("/");

    if (!owner || !repo) {
      throw new Error("Cannot find owner or repo");
    }
    return { owner, repo };
  });

if (isDryRun) {
  console.log("== Dry run started ==\n");
}

console.log(`Repo: ${owner}/${repo}`);
console.log(`Current Version: ${version}`);
console.log(`Bump Type: ${bump}`);

const nextVersion = version
  .split(".")
  .map((v, i) =>
    i === BUMP_TYPES.indexOf(bump)
      ? String(Number(v) + 1)
      : i > BUMP_TYPES.indexOf(bump)
        ? "0"
        : v,
  )
  .join(".");

console.log(`Next Version: ${nextVersion}`);

if (isDryRun) {
  console.log("\n== Dry run end ==");
  process.exit(0);
}

console.log("\nDispatching workflow...");

await $`gh api --method POST -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches -f "ref=main" -f "inputs[bump]=${bump}"`
  .quiet()
  .then(() => {
    console.log("Dispatched!");
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
