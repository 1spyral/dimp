# dimp-server AI Architecture

## Purpose

This document describes the durable architecture for AI model selection and agent policy resolution in `dimp-server`.

## Current Flow

- Workflows should depend on a policy id and `resolveAgentPolicy(...)`.
- Policy resolution should map that id to a policy definition, resolve the selected model definition, and assemble provider-specific middleware before building the LangChain agent.
- The intended flow is:
  `workflow -> agent policy id -> policy registry -> policy resolver -> model catalog or tenant override -> provider-specific middleware -> LangChain agent`

## Model Catalog

- `src/ai/models/registry.ts` is the canonical catalog of built-in models.
- Each model entry should contain stable metadata only:
  provider, source, API model name, provider-qualified model ref, and reusable capability tags.
- Keep provider quirks out of the model catalog unless they are durable metadata shared by multiple policies.

## Agent Policies

- `src/ai/agents/policies/types.ts` defines shared contracts for policy definitions and resolved policy output.
- Keep one policy definition per file under `src/ai/agents/policies/`, even when there is only one active policy.
- `src/ai/agents/policies/registry.ts` is the map from policy id to policy definition.
- `src/ai/agents/policies/resolve.ts` is responsible for model resolution and provider-specific middleware assembly.
- `src/ai/agents/policies/index.ts` is the re-export surface for the rest of the server.

## Workflow Boundary

- Workflow files should not import provider SDKs or provider-specific model instances directly.
- Workflow files should not decide which middleware a provider needs.
- Workflow files should receive the resolved agent configuration from the shared policy layer.

## Tenant Overrides

- Future tenant-supplied models should plug into `AgentPolicyResolutionContext` or a higher-level config loader that produces the same resolved model shape used by platform models.
- Keep tenant config loading, validation, and secret handling outside workflow files.
- If tenant overrides eventually support custom API gateways, preserve the same resolved policy shape so fallback and middleware logic stays shared.

## Documentation Rule

- Keep `docs/instructions/workspaces/dimp-server.md` as the workspace entrypoint.
- Put AI-specific architectural detail here once it grows beyond a short summary.
