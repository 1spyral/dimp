# Pre-Commit Workflow

## Branch And Commit Rules

- Create a working branch with the prefix `agent/`.
- Keep commits focused. Split independent concerns when practical.
- When both source and tests change, prefer separate commits if the split is still easy to review.

## Required Local Review

Before committing, read:

- [testing.md](testing.md)
- [generators.md](generators.md)
- The relevant workspace doc in `docs/instructions/workspaces/`

## Minimum Expectations

- Run the relevant lint command for each touched workspace.
- Run `bun run format:check` when formatting-sensitive files are changed or when formatting was applied.
- Run additional tests required by the touched workspace and behavior change.
- Regenerate outputs when schema, migrations, or codegen inputs change.

## Reporting

- If a required check is skipped, record the exact command and reason in the final report and PR description.
- If a doc-worthy workflow or convention changed during the work, update the relevant canonical doc before finishing.
