# Pull Requests

## Required Workflow

1. Push the working branch.
2. Create the PR with `gh pr create`.
3. Update the PR with `gh pr edit` as needed.

## PR Content

- Keep the PR small and focused.
- Use the repository PR template.
- Link the relevant issue.
- Include a short testing summary with the exact commands run.
- Note every skipped check with the exact command and reason.

## Workspace-Specific PR Notes

- Include UI screenshots for `dimp-dashboard` changes.
- If behavior or setup changes, update the relevant docs.

## Template Alignment

The PR should satisfy the expectations in `.github/pull_request_template.md`, including:

- formatting and lint confirmation
- test coverage when server runtime logic changes
- integration testing for server GraphQL, HTTP, or DB behavior changes
- generator steps when schema, migrations, or bot GraphQL operations change
