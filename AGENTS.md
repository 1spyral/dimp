# Repository Guidelines

## Layout

- Workspaces: `dimp-auth/`, `dimp-server/`, `dimp-bot/`, `dimp-dashboard/`
- Root tooling: `package.json`, `bun.lock`, `.prettierrc`, `SETUP.md`, `CONTRIBUTING.md`

## Commands

- Install once: `bun install`
- Dev (auth): `bun run --cwd dimp-auth dev`
- Dev (server): `bun run --cwd dimp-server dev`
- Dev (bot): `bun run --cwd dimp-bot dev`
- Dev (dashboard): `bun run --cwd dimp-dashboard dev`
- Lint: `bun run --cwd <workspace> lint`
- Format check: `bun run format:check`
- Generator (server schema): `bun run --cwd dimp-server generate-schema`
- Generator (bot codegen): `bun run --cwd dimp-bot codegen`

## Coding Style

- TypeScript + ESM
- Prettier: `tabWidth: 4`, double quotes, no semicolons, trailing commas (`es5`)
- Naming: `camelCase` vars/functions, `PascalCase` React components and listener folders

## Tests

- Always: `bun run --cwd <workspace> lint`
- When formatting changes: `bun run format:check`
- When `dimp-server` runtime logic changes: `bun run --cwd dimp-server test`
- When `dimp-server` runtime logic changes: `bun run --cwd dimp-server test:coverage`
- When `dimp-server` GraphQL/DB behavior changes: `bun run --cwd dimp-server test:integration:local` (preferred)
- When `dimp-server` GraphQL/DB behavior changes: `bun run --cwd dimp-server test:integration`

## Migrations

- Do not create migration files by hand.
- Standard: `bun run db:generate --name <name>`
- Custom: `bun run db:generate --custom`

## Generators

- If schema/codegen inputs change, regenerate and commit outputs.

## Before You Finish

- Changes committed
- Checks/tests run (or explicitly skipped with reason)
- Generated files updated if applicable

## Required Workflow (Do Not Skip)

1. Create a working branch (prefix `agent/`).
2. Make focused commits (split by concern; keep `src/` and `tests/` separate when practical).
3. Push your branch.
4. Create the PR with `gh pr create` and update it with `gh pr edit` as needed.
5. Keep the PR small and focused, use the template, link the issue, include a testing summary, and note skipped checks.
6. Include UI screenshots for `dimp-dashboard` changes.

## Skip Policy

- If a check cannot run, say exactly which command and why in final response and PR description.
