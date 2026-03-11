# dimp-auth

## Scope

`dimp-auth` is the auth service workspace.

## Primary Commands

- Dev: `bun run --cwd dimp-auth dev`
- Lint: `bun run --cwd dimp-auth lint`
- Migrations: `bun run --cwd dimp-auth db:generate --name <name>`
- Apply migrations: `bun run --cwd dimp-auth db:migrate`
- JWKS rotation script: `bun run --cwd dimp-auth jwks:rotate`

## Working Rules

- Read the shared workflow docs before changing auth code.
- Keep setup and runtime environment guidance in `dimp-auth/SETUP.md`.
- Do not hand-write migration files.

## Validation

- Always run `bun run --cwd dimp-auth lint` when this workspace changes.
- If DB schema changes, generate and commit the migration output.
