# Setup (Dev)

This repo uses **Bun** workspaces.

## Prereqs

- Install Bun: https://bun.com/
- For the server: a Postgres database (local Docker, [Supabase](https://supabase.com/), Neon, etc.)
- For the bot: a Discord application + bot token

## Install deps

From the repo root:

```bash
bun install
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
