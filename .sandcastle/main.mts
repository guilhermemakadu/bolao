import { run, cursor } from "@ai-hero/sandcastle";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";

// Issue worker: picks ready-for-agent issues one by one and closes them.
// Run this with: npx tsx .sandcastle/main.mts
// Or add to package.json scripts: "sandcastle": "npx tsx .sandcastle/main.mts"

await run({
  name: "bolao-worker",
  agent: cursor("composer-2.5"),
  sandbox: docker(),
  promptFile: "./.sandcastle/prompt.md",
  maxIterations: 5,
  completionSignal: "<promise>NO MORE TASKS</promise>",
  branchStrategy: { type: "merge-to-head" },
  hooks: {
    sandbox: {
      onSandboxReady: [{ command: "npm install" }],
    },
  },
});
