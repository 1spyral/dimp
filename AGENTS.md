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
- `bun run --cwd dimp-server generate-schema`: regenerate `dimp-server/schema.graphql`
- `bun run --cwd dimp-bot codegen`: regenerate `dimp-bot/src/graphql/generated.ts`

## Coding Style & Naming Conventions

TypeScript + ESM is the default. Follow existing workspace patterns.

- Prettier enforces `tabWidth: 4`, no semicolons, double quotes, trailing commas (`es5`)
- Use ESLint per workspace before opening a PR
- Prefer descriptive names: `camelCase` for variables/functions, `PascalCase` for React components and listener folders (for example `src/listeners/MessageCreate/`)
- Keep generated files committed when changed (schema/codegen outputs)

## Testing Guidelines

There is no unified automated test suite configured at the root today. Treat linting, schema/codegen generation, and manual verification as the baseline:

- Run `bun run --cwd <workspace> lint`
- Run impacted generators (`generate-schema`, `codegen`) and commit outputs
- Smoke-test changed services locally with their `dev` command

## Commit & Pull Request Guidelines

Recent commits use short, imperative subjects (for example, `Move plugin to .prettierrc`, `Remove debugging console.log statement`) and dependency bumps (`Bump ...`).

- Keep commit messages concise and action-oriented
- Before committing, run relevant checks for touched workspaces (formatting, linting, generators, and available tests/smoke checks)
- Example: `bun run format:check` and `bun run --cwd dimp-server lint` before committing server changes
- AI agents should create their own commits for completed changes (do not leave edits uncommitted unless asked)
- Use a descriptive commit subject and, when helpful, a short body explaining what changed and why
- Keep PRs small and focused
- Link the related issue in the PR
- Update docs/setup notes when behavior or configuration changes
- Include screenshots for `dimp-dashboard` UI changes when relevant
