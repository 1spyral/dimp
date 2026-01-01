FROM oven/bun:1.3.5-alpine AS base

WORKDIR /app

COPY package.json bun.lock ./
COPY dimp-auth/package.json dimp-auth/
COPY clyde-bot/package.json clyde-bot/
COPY clyde-dashboard/package.json clyde-dashboard/
COPY clyde-server/package.json clyde-server/

FROM base AS server

RUN bun install --frozen-lockfile --production --filter clyde-server

WORKDIR /app/clyde-server
ENV NODE_ENV=production

COPY clyde-server/ ./

CMD ["bun", "run", "start"]

FROM base AS migrate

RUN bun install --frozen-lockfile --filter clyde-server

WORKDIR /app/clyde-server

COPY clyde-server/ ./

CMD ["bun", "run", "db:migrate"]
