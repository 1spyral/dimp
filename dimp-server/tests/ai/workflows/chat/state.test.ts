import { ChatStateSchema, type ChatStateType } from "@/ai/workflows/chat/state"
import { Value } from "@sinclair/typebox/value"
import { describe, expect, test } from "bun:test"

const parseChatState = (input: unknown): ChatStateType => {
    if (!Value.Check(ChatStateSchema, input)) {
        throw new Error("Invalid chat state")
    }

    return input as ChatStateType
}

describe("ChatState", () => {
    test("accepts valid chat state payloads", () => {
        const parsed = parseChatState({
            soul: "be helpful",
            history: [
                { content: "hello", user: "user-1", username: "alice" },
                { content: null },
            ],
            message: {
                content: "what's up?",
                user: "user-2",
                username: "bob",
            },
            response: "all good",
        })

        expect(parsed.history).toHaveLength(2)
        expect(parsed.soul).toBe("be helpful")
        expect(parsed.message.user).toBe("user-2")
        expect(parsed.message.username).toBe("bob")
        expect(parsed.response).toBe("all good")
    })

    test("rejects messages with non-string content", () => {
        expect(() =>
            parseChatState({
                soul: "be helpful",
                history: [],
                message: { content: 123 },
            })
        ).toThrow()
    })
})
