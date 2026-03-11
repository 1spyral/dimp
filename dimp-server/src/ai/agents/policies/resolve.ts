import {
    getModelDefinition,
    type AiModelDefinition,
    type AiModelId,
} from "@/ai/models"
import {
    anthropicPromptCachingMiddleware,
    modelFallbackMiddleware,
    type AgentMiddleware,
} from "langchain"
import { getAgentPolicyDefinition } from "./registry"
import type {
    AgentPolicyId,
    AgentPolicyResolutionContext,
    ResolvedAgentPolicy,
} from "./types"

const resolveModelDefinition = (
    modelId: AiModelId,
    context?: AgentPolicyResolutionContext
) => context?.modelOverrides?.[modelId] ?? getModelDefinition(modelId)

const buildProviderMiddleware = (
    model: AiModelDefinition,
    fallbacks: AiModelDefinition[]
): AgentMiddleware[] => {
    const middleware: AgentMiddleware[] = []

    if (model.provider === "anthropic") {
        middleware.push(anthropicPromptCachingMiddleware({ ttl: "1h" }))
    }

    if (fallbacks.length > 0) {
        middleware.push(
            modelFallbackMiddleware(
                ...fallbacks.map(fallback => fallback.modelRef)
            )
        )
    }

    return middleware
}

export const resolveAgentPolicy = (
    policyId: AgentPolicyId,
    context?: AgentPolicyResolutionContext
): ResolvedAgentPolicy => {
    const definition = getAgentPolicyDefinition(policyId)
    const primaryModel = resolveModelDefinition(
        definition.primaryModel,
        context
    )
    const fallbackModels = definition.fallbackModels.map(modelId =>
        resolveModelDefinition(modelId, context)
    )

    return {
        id: definition.id,
        primaryModel,
        fallbackModels,
        model: primaryModel.modelRef,
        middleware: buildProviderMiddleware(primaryModel, fallbackModels),
    }
}
