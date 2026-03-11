# Instructions System

## Purpose

This repo keeps detailed operational guidance in `docs/instructions/` and uses `AGENTS.md` files as discovery entrypoints.

- Root `AGENTS.md` defines repo-wide policy.
- Workspace `AGENTS.md` files define local scope and route agents to the right docs.
- The files in this directory are the canonical source of truth for detailed instructions.

## Precedence

Follow instructions in this order:

1. Root `AGENTS.md`
2. Nearest workspace `AGENTS.md`
3. The referenced files in `docs/instructions/`

If two detailed docs overlap, follow the more specific doc. Workspace guidance wins over shared workflow guidance when both apply.

## Navigation

- Read [authoring.md](authoring.md) before editing instruction docs.
- Read workflow docs in `workflows/` for cross-repo process requirements.
- Read workspace docs in `workspaces/` before changing code in a specific app or package.
- When a workspace doc links to deeper topic docs, treat the linked topic doc as part of the canonical guidance for that workspace.

## Canonical Files

- `workflows/pre-commit.md`: branch, commit, and local verification expectations before opening or updating a PR
- `workflows/pull-requests.md`: PR structure, checklist expectations, screenshots, and reporting of skipped checks
- `workflows/testing.md`: when to run lint, formatting, unit, coverage, and integration checks
- `workflows/generators.md`: migration generation, GraphQL schema generation, and bot GraphQL codegen
- `workspaces/*.md`: workspace-specific commands, boundaries, and local rules
- `workspaces/<workspace>/*.md`: deeper workspace-specific topic docs linked from the top-level workspace doc

Agents must treat `workflows/pre-commit.md` and `workflows/pull-requests.md` as required finish-checklists, not optional reference docs.

## Living Document Rule

Keep these docs current as the repo evolves.

- Update the most relevant canonical file when behavior or conventions materially change.
- Prefer in-place edits over append-only notes.
- Capture durable guidance only. Leave out temporary task context.
