import type { AgentPolicyDefinition } from "./types"

export const discordChatDefaultPolicy = {
    id: "discord-chat-default",
    primaryModel: "claude_haiku_4_5",
    fallbackModels: [],
} as const satisfies AgentPolicyDefinition
