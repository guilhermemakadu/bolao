# Context

## Open issues (ready for agent)

!`gh issue list --state open --label ready-for-agent --json number,title,body,labels,comments --limit 50 --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`

This list is the sole source of truth. Do not run your own unfiltered query to find more issues. If the list is empty, output <promise>NO MORE TASKS</promise> immediately.

## Recent commits

!`git log --oneline -10`

## Repo conventions

- Read `AGENTS.md` for skills and issue-tracker rules
- Read `docs/agents/issue-tracker.md` for `gh` commands
- Read `docs/agents/triage-labels.md` — only pick issues labeled `ready-for-agent`
- Before coding: `CONTEXT.md` (if present) and relevant `docs/adr/*`
- Working branch: {{SOURCE_BRANCH}} (base: {{TARGET_BRANCH}})

# Task

Work on **one** issue per iteration.

## Selection (in order)

1. Critical bugfixes
2. Development infrastructure
3. Tracer bullets — thin end-to-end slice first, then expand
4. Polish and quick wins
5. Refactors

Skip issues blocked by an open issue (`blocked by #N`, `depends on #N`, or explicit phase ordering in a multi-phase plan). Pick highest priority, lowest issue number.

## Workflow

1. **Explore** — read the issue carefully. Pull in the parent PRD if referenced. Read `CONTEXT.md` and relevant ADRs. Read relevant source and tests before writing code.
2. **Plan** — decide the smallest change that satisfies the issue's acceptance criteria.
3. **Implement** — vertical-slice TDD per `.cursor/skills/tdd/SKILL.md`: one failing test → minimal pass → repeat. Do not write all tests first, then all implementation. When running autonomously, skip user confirmation steps; infer scope from the issue body.
4. **Verify** — run project test and lint commands before committing. If no test script exists yet, add the minimal harness as part of infrastructure issues. Fix failures before proceeding.
5. **Commit** — make a single git commit. The message must:
   - Start with `BOLAO:` prefix
   - Reference the issue number and summary
   - Include key decisions made
   - Note blockers for the next iteration
6. **Close** — `gh issue close <number> --comment "..."` explaining what was done.

## Rules

- Do not close an issue until you have committed the fix and verified tests pass.
- Do not leave commented-out code or TODO comments in committed code.
- If blocked (missing context, failing tests you cannot fix, external dependency), leave a comment on the issue with what was tried — do not close it.

# Done

- After committing, remove any extra git worktrees you created during development. Run `git worktree list`, then for each path you added (not the current sandbox at `/home/agent/workspace`): `git worktree remove --force <worktree-path>`. Sandcastle auto-removes the iteration worktree when it has no uncommitted changes.

When **all** actionable issues are complete (or you are blocked on every remaining one), or the open-issues list is empty, output:

<promise>NO MORE TASKS</promise>

After finishing a single issue with more work still open, do **not** output the signal — let the iteration end so the next one can pick up the next issue. The loop stops early only when there is nothing left to do, or when `maxIterations` is reached.