# Testing

## Always

- Run `bun run --cwd <workspace> lint` for each touched workspace.
- Treat these commands as pre-commit requirements when they apply, not post-commit cleanup.

## Formatting

- Run `bun run format:check` when formatting changes are part of the work or when broad markdown or code formatting may have shifted.

## dimp-server

Run these when the corresponding behavior changes:

- Runtime logic: `bun run --cwd dimp-server test`
- Runtime logic: `bun run --cwd dimp-server test:coverage`
- GraphQL, HTTP, or DB behavior: `bun run --cwd dimp-server test:integration:local`
- If local integration cannot run but integration coverage is still required: `bun run --cwd dimp-server test:integration`

## Other Workspaces

- `dimp-auth`: lint is the baseline required check
- `dimp-bot`: lint is the baseline required check
- `dimp-dashboard`: lint is the baseline required check

Inference: add or update automated tests in the touched workspace whenever the change affects behavior and the workspace already has a clear testing pattern to extend.

## Reporting

- Record the exact commands run.
- If a command is skipped, record the exact command and why it was skipped.
