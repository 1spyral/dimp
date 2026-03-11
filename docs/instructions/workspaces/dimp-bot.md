# dimp-bot

## Scope

`dimp-bot` contains the Discord bot and its GraphQL client usage.

## Primary Commands

- Dev: `bun run --cwd dimp-bot dev`
- Lint: `bun run --cwd dimp-bot lint`
- Register slash commands: `bun run --cwd dimp-bot sync-commands`
- GraphQL codegen: `bun run --cwd dimp-bot codegen`

## Working Rules

- Read the shared workflow docs before changing bot code.
- Keep setup and runtime environment guidance in `dimp-bot/SETUP.md`.
- If GraphQL operations change, regenerate and commit the bot GraphQL client output.

## Validation

- Always run `bun run --cwd dimp-bot lint` when this workspace changes.
- Run `bun run --cwd dimp-bot codegen` when GraphQL operations or codegen inputs change.
