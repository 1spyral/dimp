FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY clyde-auth/package.json clyde-auth/
COPY clyde-bot/package.json clyde-bot/
COPY clyde-dashboard/package.json clyde-dashboard/
COPY clyde-server/package.json clyde-server/

RUN bun install --frozen-lockfile --filter clyde-dashboard

COPY clyde-dashboard clyde-dashboard
RUN bun run --filter clyde-dashboard build

FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/clyde-dashboard/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
