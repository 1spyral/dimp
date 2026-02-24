# Repository Guidelines

## Project Structure & Module Organization

This repo is a Bun workspace monorepo with four services:

- `dimp-auth/`: Fastify auth service (`src/`, `drizzle/`, `scripts/`)
- `dimp-server/`: GraphQL + AI backend (`src/`, `schema.graphql`, `drizzle/`)
- `dimp-bot/`: Discord bot (`src/commands/`, `src/listeners/`, `src/graphql/`)
- `dimp-dashboard/`: Vite + React frontend (`src/`, `public/`)

Root files manage shared tooling (`package.json`, `bun.lock`, `.prettierrc`) and contributor setup (`SETUP.md`, `CONTRIBUTING.md`).

## Build, Test, and Development Commands

Install dependencies once from the repo root:

```bash
bun install
```

Common commands:

- `bun run format` / `bun run format:check`: format or verify formatting across the repo
- `bun run --cwd dimp-server dev`: run a backend service in watch mode (same pattern for `dimp-auth` and `dimp-bot`)
- `bun run --cwd dimp-dashboard dev`: start the Vite frontend
- `bun run --cwd <workspace> lint`: run ESLint in a workspace
- `bun run --cwd dimp-server test` / `bun run --cwd dimp-server test:unit`: run Bun unit tests for server changes
- `bun run --cwd dimp-server test:integration:local`: run `dimp-server` integration tests with local Docker Postgres orchestration (start/migrate/test/teardown)
- `bun run --cwd dimp-server test:integration`: run `dimp-server` integration tests against an already-running test Postgres (migrations auto-apply in setup)
- `bun run --cwd dimp-server test:coverage`: run Bun unit test coverage for server changes
- `bun run --cwd dimp-server generate-schema`: regenerate `dimp-server/schema.graphql`
- `bun run --cwd dimp-bot codegen`: regenerate `dimp-bot/src/graphql/generated.ts`

## Coding Style & Naming Conventions

TypeScript + ESM is the default. Follow existing workspace patterns.

- Prettier enforces `tabWidth: 4`, no semicolons, double quotes, trailing commas (`es5`)
- Use ESLint per workspace before opening a PR
- Prefer descriptive names: `camelCase` for variables/functions, `PascalCase` for React components and listener folders (for example `src/listeners/MessageCreate/`)
- Keep generated files committed when changed (schema/codegen outputs)

## Testing Guidelines

There is no unified automated test suite configured at the root today. Treat linting, tests (when available), schema/codegen generation, and manual verification as the baseline:

- AI agents must run relevant validation commands before committing changes (do not skip lint/tests unless blocked)
- Run `bun run --cwd <workspace> lint`
- Run `bun run format:check` when touching formatted source/docs across the repo (or `bun run format` if explicitly requested)
- Add or update tests for behavior changes when practical (especially bug fixes and server runtime logic)
- For `dimp-server` runtime changes, run `bun run --cwd dimp-server test` (unit) and `bun run --cwd dimp-server test:coverage`
- For `dimp-server` GraphQL/HTTP/DB integration behavior changes, also run `bun run --cwd dimp-server test:integration:local` (preferred) or document why it was skipped
- Run impacted generators (`generate-schema`, `codegen`) and commit outputs
- Drizzle migrations must be generated, not manually created: use `bun run db:generate --name <name>` for standard migrations
- If a custom Drizzle migration is needed, generate the migration scaffold with `bun run db:generate --custom` (do not create migration files by hand)
- Smoke-test changed services locally with their `dev` command
- If a check is skipped or cannot run, the agent must state the reason in the final response and PR description

## Commit & Pull Request Guidelines

Recent commits use short, imperative subjects (for example, `Move plugin to .prettierrc`, `Remove debugging console.log statement`) and dependency bumps (`Bump ...`).

- Keep commit messages concise and action-oriented
- Before committing, run relevant checks for touched workspaces (formatting, linting, generators, and available tests/smoke checks)
- Example (server logic change): `bun run format:check`, `bun run --cwd dimp-server lint`, `bun run --cwd dimp-server test`, and `bun run --cwd dimp-server test:coverage` before committing
- Example (server GraphQL/DB behavior change): add `bun run --cwd dimp-server test:integration:local` to the checks above
- AI agents should create their own commits for completed changes (do not leave edits uncommitted unless asked)
- AI agents must create a working branch (prefix `codex/`), push it, and open the GitHub PR themselves via `gh pr create` (use `gh pr edit` to update the PR)
- PR descriptions should be detailed and follow the repository pull request template when available
- AI agents should split changes into focused commits by concern (for example: setup/config, `src/` refactors, `tests/`, docs)
- When practical, keep `src/` code changes and `tests/` changes in separate commits for easier review
- Do not batch unrelated fixes into the same commit
- Use a descriptive commit subject and, when helpful, a short body explaining what changed and why
- Keep PRs small and focused
- Link the related issue in the PR
- Update docs/setup notes when behavior or configuration changes
- Include screenshots for `dimp-dashboard` UI changes when relevant
- PR descriptions should include a brief testing summary (what was run and results)
- PR descriptions should note any intentionally skipped checks/tests and why
