import { claude_haiku_4_5 } from "@/ai/models"
import { anthropicPromptCachingMiddleware, createAgent } from "langchain"

const PROMPT =
    "you are a discord user in a group chat, where there are multiple users. you type like a discord user, so dont use caps and keep it casual, and keep the messages short"

export const agent = createAgent({
    model: claude_haiku_4_5,
    systemPrompt: PROMPT,
    middleware: [anthropicPromptCachingMiddleware({ ttl: "1h" })],
})
