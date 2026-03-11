# dimp-server Guidance

- Scope: everything under `dimp-server/`
- Read [dimp-server workspace instructions](../docs/instructions/workspaces/dimp-server.md) before editing server code.
- Also read:
    - [pre-commit workflow](../docs/instructions/workflows/pre-commit.md)
    - [testing workflow](../docs/instructions/workflows/testing.md)
    - [generators workflow](../docs/instructions/workflows/generators.md)
- Local hard rules:
    - do not hand-write migration files
    - regenerate `schema.graphql` when GraphQL types or resolvers change
