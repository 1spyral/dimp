import { messageInsertSchema } from "@/db/schema/messages"
import { describe, expect, test } from "bun:test"

describe("messageInsertSchema", () => {
    test("accepts a valid insert payload", () => {
        const now = new Date("2025-01-01T00:00:00.000Z")

        const parsed = messageInsertSchema.parse({
            id: "m-1",
            guildId: "g-1",
            channelId: "c-1",
            userId: "u-1",
            content: "hello",
            discordCreatedAt: now,
            discordUpdatedAt: now,
        })

        expect(parsed.id).toBe("m-1")
        expect(parsed.content).toBe("hello")
    })

    test("rejects missing required identifiers", () => {
        const now = new Date("2025-01-01T00:00:00.000Z")

        expect(() =>
            messageInsertSchema.parse({
                guildId: "g-1",
                channelId: "c-1",
                userId: "u-1",
                discordCreatedAt: now,
                discordUpdatedAt: now,
            })
        ).toThrow()
    })
})
