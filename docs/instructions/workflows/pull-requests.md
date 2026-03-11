# Pull Requests

## Required Workflow

1. Create at least one commit containing the completed work.
2. Push the working branch.
3. Create the PR with `gh pr create`.
4. Update the PR with `gh pr edit` as needed.

Do not stop after local changes only. For normal repository work, finishing the task includes the commit and PR steps above unless the user explicitly says not to do them.

## PR Content

- Keep the PR small and focused.
- Use the repository PR template.
- Link the relevant issue.
- Include a short testing summary with the exact commands run.
- Note every skipped check with the exact command and reason.
- If new commits are added after the PR is opened, push them and update the PR description when the testing summary or scope changed.

## Workspace-Specific PR Notes

- Include UI screenshots for `dimp-dashboard` changes.
- If behavior or setup changes, update the relevant docs.

## Template Alignment

The PR should satisfy the expectations in `.github/pull_request_template.md`, including:

- formatting and lint confirmation
- test coverage when server runtime logic changes
- integration testing for server GraphQL, HTTP, or DB behavior changes
- generator steps when schema, migrations, or bot GraphQL operations change
