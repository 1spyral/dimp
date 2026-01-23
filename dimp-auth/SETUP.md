# dimp-auth (Dev Setup)

## Prereqs

- Bun installed

## Configure env

```bash
cd dimp-auth
cp env.example .env
```

(Optional) tweak `PORT`, `HOST`, `LOG_LEVEL` in `.env`.

## Install deps

From the repo root (recommended):

```bash
cd ..

bun install
```

## Run

```bash
cd dimp-auth
bun run dev
```
