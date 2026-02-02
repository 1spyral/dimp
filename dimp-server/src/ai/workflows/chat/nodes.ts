import { Command, END } from "@langchain/langgraph"
import type { ChatStateType } from "."
import { agent } from "./agent"
import { HumanMessage } from "langchain"

export async function respondChat(state: ChatStateType) {
    const context = [
        ...state.history.map(msg => new HumanMessage(msg.content || "")),
        new HumanMessage(state.message.content || ""),
    ]

    const response = await agent.invoke({ messages: context })

    return new Command({
        update: { response: response.messages.at(-1)!.content },
        goto: END,
    })
}
