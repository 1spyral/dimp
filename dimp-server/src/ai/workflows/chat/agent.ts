import { resolveAgentPolicy } from "@/ai/agents"
import { createAgent } from "langchain"

const PROMPT =
    "you are a discord user in a group chat, where there are multiple users. you type like a discord user, so dont use caps and keep it casual, and keep the messages short"

export const CHAT_AGENT_POLICY_ID = "discord-chat-default"

export const getChatAgentConfig = () => {
    const policy = resolveAgentPolicy(CHAT_AGENT_POLICY_ID)

    return {
        model: policy.model,
        systemPrompt: PROMPT,
        middleware: policy.middleware,
    }
}

export const agent = createAgent(getChatAgentConfig())
