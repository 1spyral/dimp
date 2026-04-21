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
- Route AI model selection through the shared model catalog and policy layers in `src/ai/models.ts` and `src/ai/policies/` instead of importing provider-specific model instances directly into workflows.
- Inference: keep provider-specific middleware attached at policy resolution time so future tenant- or workspace-specific model overrides do not require workflow rewrites.

## Topic Docs

- Read [dimp-server AI architecture](./dimp-server/ai-architecture.md) when changing model selection, agent policy resolution, provider-specific middleware assembly, or future tenant gateway integration.

## Validation

- Always run `bun run --cwd dimp-server lint` when this workspace changes.
- Run `bun run --cwd dimp-server test` and `bun run --cwd dimp-server test:coverage` when runtime logic changes.
- Run `bun run --cwd dimp-server test:integration:local` when GraphQL, HTTP, or DB behavior changes.
- Generate and commit migrations or schema outputs when inputs change.
