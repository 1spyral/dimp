# Setup (Dev)

This repo uses **Bun** workspaces.

For agent-facing workflow and workspace guidance, see [docs/instructions/README.md](docs/instructions/README.md).

## Prereqs

- Install Bun: https://bun.com/
- For the server: a Postgres database (local Docker, [Supabase](https://supabase.com/), Neon, etc.)
- For the bot: a Discord application + bot token

## Install deps

From the repo root:

```bash
bun install
```

## Local worktree bootstrap (Postgres + env + migrations)

Use this to prepare a fresh git worktree with local Postgres and baseline `.env` files.
It resets each workspace `.env` from `env.example` on every run:

```bash
bun run worktree:setup
```

The script will auto-pick an open local Postgres port (starting at `54329`) to avoid collisions across parallel worktrees.

If you want to pin a specific host port, set it before running:

```bash
DIMP_PG_PORT=54330 bun run worktree:setup
```

Teardown for a worktree (stops/removes the local Postgres container and volume, then deletes the generated `.env` files):

```bash
bun run worktree:teardown
```

## Run (pick what you need)

In most cases you’ll run these in separate terminals:

- Server: dimp-server (GraphQL + DB)
- Bot: dimp-bot (Discord bot that calls the server)
- Dashboard: dimp-dashboard (Vite + React)
- Auth: dimp-auth (auth service)

Follow the per-package guides:

- [dimp-server/SETUP.md](dimp-server/SETUP.md)
- [dimp-bot/SETUP.md](dimp-bot/SETUP.md)
- [dimp-dashboard/SETUP.md](dimp-dashboard/SETUP.md)
- [dimp-auth/SETUP.md](dimp-auth/SETUP.md)

## Common scripts

- Format: `bun run format`
- Format check: `bun run format:check`
