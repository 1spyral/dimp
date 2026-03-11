import { createMessageUpdateHandler } from "@/listeners/MessageUpdate/on"
import { describe, expect, mock, test } from "bun:test"

const createMessage = (overrides: Partial<Record<string, unknown>> = {}) =>
    ({
        content: "hello",
        editedAt: new Date("2024-01-01T00:00:00.000Z"),
        id: "message-1",
        system: false,
        ...overrides,
    }) as unknown

describe("MessageUpdate", () => {
    test("ignores system messages", async () => {
        const api = { updateMessage: mock(async () => {}) }
        const handler = createMessageUpdateHandler({
            api,
            logger: { error: mock(() => {}) },
        })

        await handler(null, createMessage({ system: true }))

        expect(api.updateMessage).not.toHaveBeenCalled()
    })

    test("updates messages with fallback empty content", async () => {
        const api = { updateMessage: mock(async () => {}) }
        const handler = createMessageUpdateHandler({
            api,
            logger: { error: mock(() => {}) },
        })
        const editedAt = new Date("2024-01-01T00:00:00.000Z")

        await handler(null, createMessage({ content: "", editedAt }))

        expect(api.updateMessage).toHaveBeenCalledWith({
            id: "message-1",
            content: "",
            discordUpdatedAt: editedAt,
        })
    })

    test("logs failures", async () => {
        const logger = { error: mock(() => {}) }
        const handler = createMessageUpdateHandler({
            api: {
                updateMessage: mock(async () => {
                    throw new Error("boom")
                }),
            },
            logger,
        })

        await handler(null, createMessage())

        expect(logger.error).toHaveBeenCalledTimes(1)
    })
})
