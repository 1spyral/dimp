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
