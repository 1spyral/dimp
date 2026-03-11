import { discordChatDefaultPolicy } from "./discord_chat_default_policy"
import type { AgentPolicyDefinition, AgentPolicyId } from "./types"

const agentPolicyRegistry = {
    [discordChatDefaultPolicy.id]: discordChatDefaultPolicy,
} as const satisfies Record<AgentPolicyId, AgentPolicyDefinition>

export const getAgentPolicyDefinition = (
    policyId: AgentPolicyId
): AgentPolicyDefinition => agentPolicyRegistry[policyId]

export const getAgentPolicyIds = (): AgentPolicyId[] =>
    Object.keys(agentPolicyRegistry) as AgentPolicyId[]
