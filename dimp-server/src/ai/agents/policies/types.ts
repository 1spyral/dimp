import {
    createModel,
    type AiModelDefinition,
    type AiModelId,
} from "@/ai/models"
import type { AgentMiddleware } from "langchain"

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
