export type AiModelId =
    | "claude_haiku_4_5"
    | "gpt_4_1_mini"
    | "gpt_4_1_nano"
    | "gpt_5_mini"

export type AiModelProvider = "anthropic" | "openai"
export type AiModelSource = "platform" | "tenant-gateway"
export type AiModelCapability =
    | "prompt-caching"
    | "fast"
    | "small"
    | "inexpensive"

export interface AiModelDefinition {
    id: AiModelId
    provider: AiModelProvider
    source: AiModelSource
    apiModel: string
    modelRef: `${AiModelProvider}:${string}`
    capabilities: AiModelCapability[]
}

const platformModelRegistry = {
    claude_haiku_4_5: {
        id: "claude_haiku_4_5",
        provider: "anthropic",
        source: "platform",
        apiModel: "claude-haiku-4-5",
        modelRef: "anthropic:claude-haiku-4-5",
        capabilities: ["prompt-caching", "fast", "small", "inexpensive"],
    },
    gpt_4_1_mini: {
        id: "gpt_4_1_mini",
        provider: "openai",
        source: "platform",
        apiModel: "gpt-4.1-mini",
        modelRef: "openai:gpt-4.1-mini",
        capabilities: ["fast", "small"],
    },
    gpt_4_1_nano: {
        id: "gpt_4_1_nano",
        provider: "openai",
        source: "platform",
        apiModel: "gpt-4.1-nano",
        modelRef: "openai:gpt-4.1-nano",
        capabilities: ["fast", "small", "inexpensive"],
    },
    gpt_5_mini: {
        id: "gpt_5_mini",
        provider: "openai",
        source: "platform",
        apiModel: "gpt-5-mini",
        modelRef: "openai:gpt-5-mini",
        capabilities: ["fast"],
    },
} as const satisfies Record<AiModelId, AiModelDefinition>

export const aiModelRegistry = platformModelRegistry

export const getModelDefinition = (modelId: AiModelId): AiModelDefinition =>
    aiModelRegistry[modelId]

export const createModel = (
    modelId: AiModelId
): AiModelDefinition["modelRef"] => getModelDefinition(modelId).modelRef
