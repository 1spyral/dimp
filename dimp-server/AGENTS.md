# dimp-server Guidance

- Scope: everything under `dimp-server/`
- Read [dimp-server workspace instructions](/Users/lukezhan/.codex/worktrees/871c/dimp/docs/instructions/workspaces/dimp-server.md) before editing server code.
- Also read:
    - [pre-commit workflow](/Users/lukezhan/.codex/worktrees/871c/dimp/docs/instructions/workflows/pre-commit.md)
    - [testing workflow](/Users/lukezhan/.codex/worktrees/871c/dimp/docs/instructions/workflows/testing.md)
    - [generators workflow](/Users/lukezhan/.codex/worktrees/871c/dimp/docs/instructions/workflows/generators.md)
- Local hard rules:
    - do not hand-write migration files
    - regenerate `schema.graphql` when GraphQL types or resolvers change
