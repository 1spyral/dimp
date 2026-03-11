# dimp-dashboard

## Scope

`dimp-dashboard` contains the React and Vite dashboard application.

## Primary Commands

- Dev: `bun run --cwd dimp-dashboard dev`
- Build: `bun run --cwd dimp-dashboard build`
- Preview: `bun run --cwd dimp-dashboard preview`
- Lint: `bun run --cwd dimp-dashboard lint`

## Working Rules

- Read the shared workflow docs before changing dashboard code.
- Keep setup and runtime environment guidance in `dimp-dashboard/SETUP.md`.
- Include UI screenshots in the PR when dashboard UI changes.

## Validation

- Always run `bun run --cwd dimp-dashboard lint` when this workspace changes.

Inference: when a dashboard change is large or layout-sensitive, running `bun run --cwd dimp-dashboard build` is a useful additional verification step even though the repo-wide minimum requirement is lint.
