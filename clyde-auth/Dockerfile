FROM oven/bun:1.3.5-alpine AS base

WORKDIR /app

COPY package.json bun.lock ./
COPY clyde-auth/package.json clyde-auth/
COPY clyde-bot/package.json clyde-bot/
COPY clyde-dashboard/package.json clyde-dashboard/
COPY clyde-server/package.json clyde-server/

RUN bun install --frozen-lockfile --production --filter clyde-auth

COPY clyde-auth clyde-auth

WORKDIR /app/clyde-auth
ENV NODE_ENV=production

CMD ["bun", "run", "start"]
