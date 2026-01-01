FROM oven/bun:1.3.5-alpine AS base

WORKDIR /app

COPY package.json bun.lock ./
COPY dimp-auth/package.json dimp-auth/
COPY clyde-bot/package.json clyde-bot/
COPY clyde-dashboard/package.json clyde-dashboard/
COPY clyde-server/package.json clyde-server/

RUN bun install --frozen-lockfile --production --filter clyde-bot

COPY clyde-bot clyde-bot

WORKDIR /app/clyde-bot
ENV NODE_ENV=production

CMD ["bun", "run", "start"]
