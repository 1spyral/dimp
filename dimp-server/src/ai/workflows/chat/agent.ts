import { resolveAgentPolicy } from "@/ai/agents"
import { DEFAULT_GUILD_SOUL } from "@/config/guild-soul"
import { createAgent } from "langchain"

const STYLE_GUIDE =
    "you are in a discord group chat with multiple users. type like a discord user: keep it casual, keep messages short, and avoid caps unless needed."

export const CHAT_AGENT_POLICY_ID = "discord-chat-default"

export const buildChatSystemPrompt = (soul: string) =>
    `${soul.trim()}\n\n${STYLE_GUIDE}`

export const getChatAgentConfig = async (soul = DEFAULT_GUILD_SOUL) => {
    const policy = await resolveAgentPolicy(CHAT_AGENT_POLICY_ID)

    return {
        model: policy.model,
        systemPrompt: buildChatSystemPrompt(soul),
        middleware: policy.middleware,
    }
}

export const createChatAgent = async (soul = DEFAULT_GUILD_SOUL) =>
    createAgent(await getChatAgentConfig(soul))

export const agent = await createChatAgent()
