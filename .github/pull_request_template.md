<!-- Link to the issue you are working on. -->

Fixes #

## What’s changed

<!-- Include screenshots / logs if relevant to changes. -->

-
-
-

## Testing

<!-- List the exact commands you ran and the result. Include test coverage command(s) when server logic changes.
If you changed dimp-server GraphQL/HTTP/DB behavior, include integration testing (`test:integration:local` preferred). -->

- `...`

## Checklist

- [ ] I have run `bun run format`.
- [ ] I have run relevant lint(s): `bun run --cwd <workspace> lint`.
- [ ] I added/updated tests for behavior changes (or documented why tests are not applicable).
- [ ] If I changed `dimp-server` runtime logic, I ran `bun run --cwd dimp-server test`.
- [ ] If I changed `dimp-server` GraphQL/HTTP/DB behavior, I ran `bun run --cwd dimp-server test:integration:local` (or documented why I skipped it).
- [ ] If I changed `dimp-server` runtime logic, I ran `bun run --cwd dimp-server test:coverage`.
- [ ] If applicable, I have updated Drizzle migrations:
      <!-- If you changed DB schema in dimp-server/src/db/schema -->
    - [ ] `bun run --cwd dimp-server drizzle-kit generate --name <migration_name>`.
      <!-- If you changed DB schema in dimp-auth/src/db/schema -->
    - [ ] `bun run --cwd dimp-auth drizzle-kit generate --name <migration_name>`.
      <!-- If you changed GraphQL schema/resolvers -->
- [ ] If applicable, I regenerated the GraphQL schema: `bun run --cwd dimp-server generate-schema`.
  <!-- If you changed bot GraphQL operations -->
- [ ] If applicable, I ran GraphQL codegen: `bun run --cwd dimp-bot codegen`.
