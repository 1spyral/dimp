import { Command, END } from "@langchain/langgraph"
import { claude_haiku_4_5 } from "@/ai/models"
import type { ChatStateType } from "."

export async function respondChat(state: ChatStateType) {
    const context = [
        {
            role: "system",
            content:
                "you are a discord user in a group chat, where there are multiple users. you type like a discord user, so dont use caps and keep it casual, and keep the messages short",
        },
        ...state.history.map(msg => ({
            role: "user",
            content: msg.content || "",
        })),
        { role: "user", content: state.message.content || "" },
    ]

    const response = await claude_haiku_4_5.invoke(context)

    return new Command({
        update: { response: response.text },
        goto: END,
    })
}
