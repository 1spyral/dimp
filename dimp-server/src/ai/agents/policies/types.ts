import type {
    AiModelDefinition,
    AiModelId,
    AiModelInitConfig,
} from "@/ai/models"
import type {
    BaseChatModel,
    BaseChatModelCallOptions,
} from "@langchain/core/language_models/chat_models"
import type { AIMessageChunk } from "@langchain/core/messages"
import type { AgentMiddleware } from "langchain"

export type AgentPolicyId = "discord-chat-default"

export interface AgentPolicyDefinition {
    id: AgentPolicyId
    primaryModel: AiModelId
    fallbackModels: AiModelId[]
}

export interface AgentPolicyResolutionContext {
    modelOverrides?: Partial<Record<AiModelId, AiModelDefinition>>
    modelInitOverrides?: Partial<Record<AiModelId, AiModelInitConfig>>
}

export interface ResolvedAgentPolicy {
    id: AgentPolicyId
    primaryModel: AiModelDefinition
    fallbackModels: AiModelDefinition[]
    model: BaseChatModel<BaseChatModelCallOptions, AIMessageChunk>
    middleware: AgentMiddleware[]
}
