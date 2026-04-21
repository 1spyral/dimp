import { env } from "@/env"
import { beforeEach, describe, expect, mock, test } from "bun:test"
import { AIMessage, HumanMessage } from "langchain"

const invokeMock = mock(async () => ({
    messages: [new AIMessage("stubbed response")],
}))

mock.module("@/ai/workflows/chat/agent", () => ({
    createChatAgent: mock(async () => ({
        invoke: invokeMock,
    })),
}))

const { respondChat } = await import("@/ai/workflows/chat")

describe("respondChat", () => {
    beforeEach(() => {
        invokeMock.mockClear()
    })

    test("formats human messages with usernames before invoking the agent", async () => {
        await respondChat({
            soul: "reply like a weird little helper",
            history: [
                {
                    content: "first",
                    user: "u-1",
                    username: "alice",
                },
                {
                    content: "bot reply",
                    user: env.DISCORD_CLIENT_ID,
                },
                {
                    content: "second",
                    user: "u-2",
                },
            ],
            message: {
                content: "current message",
                user: "u-3",
                username: "carol",
            },
        })

        const context = invokeMock.mock.calls[0]?.[0].messages
        expect(context).toHaveLength(4)
        expect(context?.[0]).toBeInstanceOf(HumanMessage)
        expect(context?.[0]?.content).toBe("alice: first")
        expect(context?.[1]).toBeInstanceOf(AIMessage)
        expect(context?.[1]?.content).toBe("bot reply")
        expect(context?.[2]).toBeInstanceOf(HumanMessage)
        expect(context?.[2]?.content).toBe("u-2: second")
        expect(context?.[3]).toBeInstanceOf(HumanMessage)
        expect(context?.[3]?.content).toBe("carol: current message")
    })
})
