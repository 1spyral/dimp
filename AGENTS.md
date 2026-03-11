# Repository Guidance

## Scope And Precedence

- This file defines repo-wide instructions for the entire monorepo.
- When working inside a workspace, also read the nearest local `AGENTS.md`.
- Detailed guidance lives under `docs/instructions/`. Treat those docs as the canonical source of truth for workflows and workspace-specific conventions.
- Precedence order:
    1. Root `AGENTS.md`
    2. Nearest workspace `AGENTS.md`
    3. Referenced files in `docs/instructions/`

## Required Reading

- Read [docs/instructions/README.md](docs/instructions/README.md) before reorganizing docs or relying on the instruction system.
- Read [docs/instructions/authoring.md](docs/instructions/authoring.md) before creating or editing instruction docs.
- Read the relevant workflow doc in `docs/instructions/workflows/` before making changes.
- Read the relevant workspace doc in `docs/instructions/workspaces/` before editing code in that workspace.

## Global Rules

- Workspaces: `dimp-auth/`, `dimp-server/`, `dimp-bot/`, `dimp-dashboard/`
- Root tooling lives in `package.json`, `bun.lock`, `.prettierrc`, `SETUP.md`, and `CONTRIBUTING.md`.
- Use Bun workspace commands from the repo root unless a workspace doc says otherwise.
- Do not hand-write migration files. Use the documented generation commands.
- If schema or codegen inputs change, regenerate and commit generated outputs.
- If a check cannot run, say exactly which command was skipped and why.

## Required Finish Workflow

- Before creating a commit, run every required formatting, lint, test, and generation command that applies to the files you changed.
- Do not commit work that still needs a required formatter, linter, test, schema generation step, codegen step, or migration generation step.
- Before finishing a task, create at least one commit for your changes unless the user explicitly tells you not to commit.
- Before finishing a task, push your branch and create or update the PR unless the user explicitly tells you not to.
- Use [docs/instructions/workflows/pre-commit.md](docs/instructions/workflows/pre-commit.md) and [docs/instructions/workflows/pull-requests.md](docs/instructions/workflows/pull-requests.md) as the canonical checklist.

## Living Docs Policy

- `docs/instructions/` is a living knowledge base that agents are expected to maintain.
- Update the relevant canonical doc when code, workflows, conventions, or durable implementation patterns materially change.
- Prefer updating an existing section over creating a duplicate doc.
- Only add:
    - verified facts grounded in repo state, CI, scripts, templates, or explicit user decisions
    - stable, reusable inferred conventions labeled `Inference:`
- Do not add speculative notes, temporary debugging logs, or one-off task history.
- Keep `AGENTS.md` files thin. Put detailed guidance in `docs/instructions/`.
