import { Command, END } from "@langchain/langgraph"
import type { ChatStateType } from "."
import { agent } from "./agent"
import { AIMessage, HumanMessage } from "langchain"
import { env } from "@/env"

export async function respondChat(state: ChatStateType) {
    const context = [
        ...state.history.map(msg => {
            if (msg.user == env.DISCORD_CLIENT_ID) {
                return new AIMessage(msg.content || "")
            } else {
                return new HumanMessage(msg.content || "")
            }
        }),
        new HumanMessage(state.message.content || ""),
    ]

    console.log("Chat context:", context)

    const response = await agent.invoke({ messages: context })

    return new Command({
        update: { response: response.messages.at(-1)!.content },
        goto: END,
    })
}
