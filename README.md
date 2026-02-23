# dimp

[![CI Pipeline](https://github.com/1spyral/dimp/actions/workflows/ci.yml/badge.svg?branch=main)][ci-pipeline]
[![Latest Release](https://img.shields.io/github/v/release/1spyral/dimp)][latest-release]

dimp (Discord Imp) is a Discord bot that acts like a customizable user in your server — a member that can chat, develop a personality, and build memories over time.

## Setup

See [SETUP.md](SETUP.md) for dev environment setup.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Testing

### `dimp-server`

- Unit tests: `bun run --cwd dimp-server test:unit`
- Integration tests (local Docker Postgres + migrations + tests + teardown): `bun run --cwd dimp-server test:integration:local`

Notes:

- `bun run --cwd dimp-server test` now runs `test:unit`
- `bun run --cwd dimp-server test:integration` expects a reachable Postgres test database and will auto-apply migrations during test setup
- `test:integration:local` selects a free local port automatically, so it does not depend on `54329` being available

[ci-pipeline]: https://github.com/1spyral/dimp/actions/workflows/ci.yml
[latest-release]: https://github.com/1spyral/dimp/releases/latest
