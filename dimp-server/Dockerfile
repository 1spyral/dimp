FROM oven/bun:1.3.13-alpine AS base

WORKDIR /app

COPY package.json bun.lock ./
COPY dimp-auth/package.json dimp-auth/
COPY dimp-bot/package.json dimp-bot/
COPY dimp-dashboard/package.json dimp-dashboard/
COPY dimp-server/package.json dimp-server/

FROM base AS server

RUN bun install --frozen-lockfile --production --filter dimp-server
WORKDIR /app/dimp-server
ENV NODE_ENV=production

COPY dimp-server/ ./

CMD ["bun", "run", "start"]

FROM base AS migrate

RUN bun install --frozen-lockfile --filter dimp-server

WORKDIR /app/dimp-server

COPY dimp-server/ ./

CMD ["bun", "run", "db:migrate"]
