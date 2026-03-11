# Pre-Commit Workflow

## Branch And Commit Rules

- Create a working branch with the prefix `agent/`.
- Run required verification before creating a commit.
- Keep commits focused. Split independent concerns when practical.
- When both source and tests change, prefer separate commits if the split is still easy to review.
- Do not skip required formatting, linting, tests, or generators just because the change seems small.

## Required Local Review

Before committing, read:

- [testing.md](testing.md)
- [generators.md](generators.md)
- The relevant workspace doc in `docs/instructions/workspaces/`

## Minimum Expectations

- Run the relevant lint command for each touched workspace before committing.
- Run `bun run format:check` before committing when formatting-sensitive files are changed or when formatting was applied.
- Run additional tests required by the touched workspace and behavior change before committing.
- Regenerate outputs before committing when schema, migrations, or codegen inputs change.
- Do not create a commit until the required commands above have been run or explicitly skipped with a recorded reason.

## Commit Gate

Before creating a commit, confirm all of the following:

- The required formatting check has been run if applicable.
- The required lint command has been run for each touched workspace.
- Required tests have been run for the affected behavior.
- Required generated outputs have been regenerated and staged.
- Any skipped command has a precise reason ready for the final report and PR description.

## Reporting

- If a required check is skipped, record the exact command and reason in the final report and PR description.
- If a doc-worthy workflow or convention changed during the work, update the relevant canonical doc before finishing.
