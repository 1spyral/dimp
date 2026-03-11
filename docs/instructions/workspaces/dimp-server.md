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
- Route AI model selection through the shared registry and agent policy layers in `src/ai/models/` and `src/ai/agents/` instead of importing provider-specific model instances directly into workflows.
- Inference: keep provider-specific middleware attached at policy resolution time so future tenant- or workspace-specific model overrides do not require workflow rewrites.

## AI Architecture

- `src/ai/models/registry.ts` is the canonical catalog of built-in models. Each entry should describe stable metadata only: provider, source, API model name, provider-qualified model ref, and reusable capability tags.
- `src/ai/agents/policies/` is the canonical home for agent-to-model selection. Keep this split by responsibility:
- `types.ts`: shared contracts for policy definitions and resolved policy output.
- `*_policy` files: one file per agent policy, even when there is only one current policy.
- `registry.ts`: the map from policy id to policy definition.
- `resolve.ts`: model resolution plus provider-specific middleware assembly.
- `index.ts`: re-export surface for the rest of the server.
- Workflows should depend only on a policy id and `resolveAgentPolicy(...)`. They should not know which provider is active, which middleware is required, or whether the model came from the platform catalog or a tenant override.
- The intended resolution flow is: workflow -> agent policy id -> policy registry -> policy resolver -> model catalog or tenant override -> provider-specific middleware -> LangChain agent.
- Future tenant-supplied models should plug into `AgentPolicyResolutionContext` or a higher-level config loader that produces equivalent model definitions. Keep tenant loading and validation outside workflow files.
- If tenant overrides eventually support custom API gateways, preserve the same resolved shape used by built-in models so fallback and middleware logic stays shared.

## Validation

- Always run `bun run --cwd dimp-server lint` when this workspace changes.
- Run `bun run --cwd dimp-server test` and `bun run --cwd dimp-server test:coverage` when runtime logic changes.
- Run `bun run --cwd dimp-server test:integration:local` when GraphQL, HTTP, or DB behavior changes.
- Generate and commit migrations or schema outputs when inputs change.
