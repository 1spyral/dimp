import {
    getModelDefinition,
    type AiModelDefinition,
    type AiModelId,
    type AiModelInitConfig,
} from "@/ai/models"
import {
    anthropicPromptCachingMiddleware,
    initChatModel,
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

const resolveModelInitConfig = (
    model: AiModelDefinition,
    context?: AgentPolicyResolutionContext
): AiModelInitConfig => ({
    modelProvider: model.provider,
    ...model.initConfig,
    ...context?.modelInitOverrides?.[model.id],
})

const createConfiguredModel = (
    model: AiModelDefinition,
    context?: AgentPolicyResolutionContext
) => initChatModel(model.apiModel, resolveModelInitConfig(model, context))

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

export const resolveAgentPolicy = async (
    policyId: AgentPolicyId,
    context?: AgentPolicyResolutionContext
): Promise<ResolvedAgentPolicy> => {
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
        model: await createConfiguredModel(primaryModel, context),
        middleware: buildProviderMiddleware(primaryModel, fallbackModels),
    }
}
