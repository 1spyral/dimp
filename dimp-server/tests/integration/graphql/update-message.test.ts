import { db } from "@/drizzle"
import { describe, expect, test } from "bun:test"
import { graphqlRequest, seedMessage } from "../helpers"

describe("integration: GraphQL updateMessage", () => {
    test("updates an existing message", async () => {
        const seeded = await seedMessage({
            id: "it-update-message-1",
            content: "before update",
        })

        const discordUpdatedAt = "2025-01-01T00:05:00.000Z"
        const discordDeletedAt = "2025-01-01T00:10:00.000Z"

        const updateMutation = `
            mutation UpdateMessage($input: UpdateMessageInput!) {
                updateMessage(input: $input) {
                    id
                    content
                    discordUpdatedAt
                    discordDeletedAt
                }
            }
        `

        const result = await graphqlRequest<{
            updateMessage: {
                id: string
                content: string | null
                discordUpdatedAt: string
                discordDeletedAt: string | null
            } | null
        }>(updateMutation, {
            input: {
                id: seeded.id,
                content: "after update",
                discordUpdatedAt,
                discordDeletedAt,
            },
        })

        expect(result.errors).toBeUndefined()
        expect(result.data?.updateMessage).toEqual({
            id: seeded.id,
            content: "after update",
            discordUpdatedAt,
            discordDeletedAt,
        })

        const row = await db.query.messages.findFirst({
            where: (message, { eq }) => eq(message.id, seeded.id),
        })

        expect(row).toBeDefined()
        expect(row?.content).toBe("after update")
        expect(row?.discordDeletedAt?.toISOString()).toBe(discordDeletedAt)
    })
})
