import { env } from "@/env"
import { Command, END } from "@langchain/langgraph"
import { AIMessage, HumanMessage } from "langchain"
import { agent } from "./agent"
import type { ChatStateType } from "./state"

const toHumanMessageContent = (message: ChatStateType["message"]) => {
    const displayName = message.username ?? message.user

    if (!displayName) {
        return message.content || ""
    }

    return `${displayName}: ${message.content || ""}`
}

export async function respondChat(state: ChatStateType) {
    const context = [
        ...state.history.map(msg => {
            if (msg.user == env.DISCORD_CLIENT_ID) {
                return new AIMessage(msg.content || "")
            } else {
                return new HumanMessage(toHumanMessageContent(msg))
            }
        }),
        new HumanMessage(toHumanMessageContent(state.message)),
    ]

    const response = await agent.invoke({ messages: context })

    return new Command({
        update: { response: response.messages.at(-1)!.content },
        goto: END,
    })
}
