import {
    createModel,
    getModelDefinition,
    type AiModelDefinition,
    type AiModelId,
} from "@/ai/models"
import {
    anthropicPromptCachingMiddleware,
    modelFallbackMiddleware,
    type AgentMiddleware,
} from "langchain"

export type AgentPolicyId = "discord-chat-default"

export interface AgentPolicyDefinition {
    id: AgentPolicyId
    primaryModel: AiModelId
    fallbackModels: AiModelId[]
}

export interface AgentPolicyResolutionContext {
    modelOverrides?: Partial<Record<AiModelId, AiModelDefinition>>
}

export interface ResolvedAgentPolicy {
    id: AgentPolicyId
    primaryModel: AiModelDefinition
    fallbackModels: AiModelDefinition[]
    model: ReturnType<typeof createModel>
    middleware: AgentMiddleware[]
}

const agentPolicyRegistry = {
    "discord-chat-default": {
        id: "discord-chat-default",
        primaryModel: "claude_haiku_4_5",
        fallbackModels: [],
    },
} as const satisfies Record<AgentPolicyId, AgentPolicyDefinition>

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

export const getAgentPolicyDefinition = (
    policyId: AgentPolicyId
): AgentPolicyDefinition => agentPolicyRegistry[policyId]

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
