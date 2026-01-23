# dimp-server (Dev Setup)

## Prereqs

- Postgres database ([Supabase](https://supabase.com/)/Neon/local)
- Bun installed

## Configure env

```bash
cd dimp-server
cp env.example .env
```

Set at least:

- `DATABASE_URL` (required)
- `OPENAI_API_KEY` (optional)

## Install deps

From the repo root (recommended):

```bash
cd ..
bun install
```

## Run migrations

```bash
cd dimp-server
bun run db:migrate
```

## Run dev server

```bash
bun run dev
```
