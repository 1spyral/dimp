# dimp-server

## Scope

`dimp-server` contains the GraphQL and database-backed server runtime.

## Primary Commands

- Dev: `bun run --cwd dimp-server dev`
- Lint: `bun run --cwd dimp-server lint`
- Unit tests: `bun run --cwd dimp-server test`
- Coverage: `bun run --cwd dimp-server test:coverage`
- Integration tests: `bun run --cwd dimp-server test:integration:local`
- Schema generation: `bun run --cwd dimp-server generate-schema`
- Migrations: `bun run --cwd dimp-server db:generate --name <name>`
- Apply migrations: `bun run --cwd dimp-server db:migrate`

## Working Rules

- Read the shared workflow docs before changing server code.
- Keep setup and runtime environment guidance in `dimp-server/SETUP.md`.
- Do not hand-write migration files.
- If GraphQL types or resolvers change, regenerate and commit `schema.graphql`.

## Validation

- Always run `bun run --cwd dimp-server lint` when this workspace changes.
- Run `bun run --cwd dimp-server test` and `bun run --cwd dimp-server test:coverage` when runtime logic changes.
- Run `bun run --cwd dimp-server test:integration:local` when GraphQL, HTTP, or DB behavior changes.
- Generate and commit migrations or schema outputs when inputs change.
