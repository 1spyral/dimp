# dimp-bot (Dev Setup)

## Prereqs

- Bun installed
- A Discord application + bot token: https://discord.com/developers/docs/quick-start/getting-started
- dimp-server running (you’ll need its GraphQL URL)

## Configure env

```bash
cd dimp-bot
cp env.example .env
```

Set:

- `PORT` (optional, defaults to `3000`)
- `HOST` (optional, defaults to `0.0.0.0`)
- `DISCORD_CLIENT_ID`
- `DISCORD_TOKEN`
- `GRAPHQL_API_URL`

## Install deps

From the repo root (recommended):

```bash
cd ..
bun install
```

## One-time: register slash commands

```bash
cd dimp-bot
bun run sync-commands
```

## Run bot

```bash
bun run dev
```

The bot exposes Kubernetes-style health endpoints on `http://HOST:PORT`:

- `GET /livez` returns `200 Live` while the process is running
- `GET /readyz` returns `200 Ready` after the Discord client is ready
- `GET /` remains available as a deprecated legacy healthcheck path
