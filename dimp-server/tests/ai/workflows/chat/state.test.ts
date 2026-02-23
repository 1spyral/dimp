import { ChatState } from "@/ai/workflows/chat/state"
import { describe, expect, test } from "bun:test"

describe("ChatState", () => {
    test("accepts valid chat state payloads", () => {
        const parsed = ChatState.parse({
            history: [{ content: "hello", user: "user-1" }, { content: null }],
            message: { content: "what's up?", user: "user-2" },
            response: "all good",
        })

        expect(parsed.history).toHaveLength(2)
        expect(parsed.message.user).toBe("user-2")
        expect(parsed.response).toBe("all good")
    })

    test("rejects messages with non-string content", () => {
        expect(() =>
            ChatState.parse({
                history: [],
                message: { content: 123 },
            })
        ).toThrow()
    })
})
