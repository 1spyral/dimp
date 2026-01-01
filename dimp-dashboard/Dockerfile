FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY dimp-auth/package.json dimp-auth/
COPY dimp-bot/package.json dimp-bot/
COPY dimp-dashboard/package.json dimp-dashboard/
COPY clyde-server/package.json clyde-server/

RUN bun install --frozen-lockfile --filter dimp-dashboard

COPY dimp-dashboard dimp-dashboard
RUN bun run --filter dimp-dashboard build

FROM nginx:1.29-alpine AS runtime

COPY --from=build /app/dimp-dashboard/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
