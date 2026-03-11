import { describe, expect, test } from "bun:test"

describe("workflow imports", () => {
    test("imports the real workflow modules without provider resolution errors", async () => {
        process.env.ANTHROPIC_API_KEY ??= "test-anthropic-key"

        const workflows = await import("@/ai/workflows")
        const chatAgentModule = await import("@/ai/workflows/chat/agent")

        expect(workflows.chatWorkflow).toBeDefined()
        expect(chatAgentModule.agent).toBeDefined()
    })
})
