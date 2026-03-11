# Generators And Derived Files

## Migrations

- Do not create migration files by hand.
- Standard migration generation: `bun run db:generate --name <name>`
- Custom migration generation: `bun run db:generate --custom`

When schema changes affect a specific workspace:

- `dimp-server`: run `bun run --cwd dimp-server db:generate --name <name>`
- `dimp-auth`: run `bun run --cwd dimp-auth db:generate --name <name>`

## GraphQL Schema

If `dimp-server` GraphQL types or resolvers change:

- Run `bun run --cwd dimp-server generate-schema`
- Commit the updated `dimp-server/schema.graphql`

## Bot Codegen

If bot GraphQL operations change:

- Run `bun run --cwd dimp-bot codegen`
- Commit the updated generated GraphQL client output

## CI Alignment

CI checks the following derived outputs:

- Drizzle migrations for `dimp-auth` and `dimp-server`
- `dimp-server/schema.graphql`
- `dimp-bot/src/graphql/generated.ts`
