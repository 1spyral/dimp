# Contributing

Thanks for contributing! This repo is a monorepo using [Bun workspaces](https://bun.com/docs/pm/workspaces).

## Getting started

- Follow the dev setup guide: [SETUP.md](SETUP.md)
- Install dependencies from the repo root:

```bash
bun install
```

## Workflow

1. Find an issue you want to work on (or open a new one): https://github.com/1spyral/dimp/issues
2. Comment on the issue stating your intent to work on it.
3. A maintainer/contributor will assign the issue to you.
4. Make changes on a fork.
5. Open a PR back to this repo and link the issue.

## CI checks

CI runs a few preflight checks that you can (and should) run locally before opening a PR:

### Lockfile is up to date

If you changed dependencies, run:

```bash
bun install
```

CI will fail if `bun.lock` is out of sync.

### Formatting (Prettier)

```bash
bun run format
bun run format:check
```

### Linting (per workspace)

```bash
bun run --cwd dimp-auth lint
bun run --cwd dimp-bot lint
bun run --cwd dimp-dashboard lint
bun run --cwd dimp-server lint
```

### GraphQL schema generation (server)

If you changed GraphQL types/resolvers, regenerate and commit the schema:

```bash
bun run --cwd dimp-server generate-schema
```

CI checks that `dimp-server/schema.graphql` has no diff.

### GraphQL codegen (bot)

If you changed GraphQL operations used by the bot (queries/mutations), regenerate and commit:

```bash
bun run --cwd dimp-bot codegen
```

CI checks that `dimp-bot/src/graphql/generated.ts` has no diff.

## PR conventions

- Keep PRs small and focused.
- Update docs when behavior or setup changes.
- Prefer matching existing patterns in the workspace you’re touching.
