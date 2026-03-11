# Documentation Authoring

## Purpose

These docs are AI-first operational guidance that humans can also read. They are living documents and should be updated when the repo changes in ways that affect future work.

## Required Format

- Use short, direct sections with stable headings.
- Prefer decision-oriented guidance over broad explanation.
- Keep repo-wide workflow rules in `workflows/`.
- Keep workspace-specific guidance in `workspaces/`.
- Keep each top-level workspace doc as the entrypoint for that workspace.
- Keep `AGENTS.md` files short and use them to route readers to canonical docs.
- Include exact commands only when they are authoritative and supported by the repo today.

## Splitting Large Docs

- Prefer expanding an existing canonical doc first.
- When a workspace doc starts accumulating one deep topic such as AI architecture, deployment, or testing nuance, split that topic into a focused subdocument under a workspace-specific folder and keep the top-level workspace doc as the index.
- Top-level workspace docs should stay good entrypoints: scope, primary commands, local rules, validation, and links to deeper topic docs.
- Topic docs should cover one durable concern each and be linked from the owning workspace doc.
- Do not create a topic doc if the content is still short enough to fit cleanly inside the existing workspace doc.

## Allowed Content

You may add:

- Verified facts from code, scripts, CI workflows, templates, or explicit user decisions
- Reusable patterns learned during implementation when they are likely to matter again
- Stable inferred conventions labeled `Inference:`

## Disallowed Content

Do not add:

- Temporary task notes
- Debugging journals
- Personal reminders
- Speculative future ideas presented as current policy
- Stale migration instructions or commands that are not backed by the repo

## Update Rules

- Update docs when code, workflows, conventions, or durable implementation patterns materially change.
- Do not update docs for every tiny refactor.
- Edit the most relevant canonical file in place instead of appending a running history log.
- Prefer expanding an existing section over creating a new doc with overlapping guidance.
- If a doc becomes too broad, split it by concern instead of letting one file become the dumping ground for unrelated rules.
- If a change affects multiple workspaces or workflows, update the shared workflow doc first and add workspace-specific nuance only where needed.

## Evidence Standard

- Verified guidance should be grounded in the repository as it exists now.
- `Inference:` may be used for stable conventions that are not explicitly encoded but are well supported by existing patterns.
- If a point cannot be verified and is not a stable inference, leave it out.

## Review Checklist

Before saving instruction docs, confirm:

- The guidance is canonical, not duplicated elsewhere without reason.
- Commands match `package.json`, CI, and templates.
- Scope is clear: repo-wide versus workspace-specific.
- Any inferred guidance is labeled `Inference:`.
