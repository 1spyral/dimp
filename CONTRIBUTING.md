# Contributing

Thanks for contributing! This repo is a monorepo using [Bun workspaces](https://bun.com/docs/pm/workspaces).

## Getting started

- Follow the dev setup guide: [SETUP.md](SETUP.md)
- For the canonical workflow and workspace guidance, see [docs/instructions/README.md](docs/instructions/README.md)
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

CI runs preflight checks that should be mirrored locally before opening a PR. Use the canonical workflow docs for the exact commands and triggers:

- [Testing workflow](docs/instructions/workflows/testing.md)
- [Generators and derived files](docs/instructions/workflows/generators.md)
- [Pull request workflow](docs/instructions/workflows/pull-requests.md)

If you changed dependencies, run `bun install`. CI will fail if `bun.lock` is out of sync.

If your change affects behavior, add or update tests in the touched workspace whenever practical.

## PR conventions

- Keep PRs small and focused.
- Update docs when behavior or setup changes.
- Prefer matching existing patterns in the workspace you’re touching.
- Include a short "Testing" section in the PR describing what was run (lint/tests/generators) and results.
- If you skip a check, state the exact command and why it was skipped.
