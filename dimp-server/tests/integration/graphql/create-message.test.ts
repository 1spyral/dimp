import { db } from "@/drizzle"
import { describe, expect, test } from "bun:test"
import { graphqlRequest } from "../helpers"

describe("integration: GraphQL createMessage", () => {
    test("creates a message and persists it", async () => {
        const id = "it-create-message-1"
        const timestamp = "2025-01-01T00:00:00.000Z"

        const createMutation = `
            mutation CreateMessage($input: CreateMessageInput!) {
                createMessage(input: $input) {
                    id
                    content
                    guildId
                    channelId
                    userId
                    discordCreatedAt
                    discordUpdatedAt
                    createdAt
                    updatedAt
                }
            }
        `

        const result = await graphqlRequest<{
            createMessage: {
                id: string
                content: string | null
                guildId: string
                channelId: string
                userId: string
                discordCreatedAt: string
                discordUpdatedAt: string
                createdAt: string
                updatedAt: string
            }
        }>(createMutation, {
            input: {
                id,
                guildId: "g-1",
                channelId: "c-1",
                userId: "u-1",
                content: "hello integration",
                discordCreatedAt: timestamp,
                discordUpdatedAt: timestamp,
            },
        })

        expect(result.errors).toBeUndefined()
        expect(result.data?.createMessage).toMatchObject({
            id,
            content: "hello integration",
            guildId: "g-1",
            channelId: "c-1",
            userId: "u-1",
            discordCreatedAt: timestamp,
            discordUpdatedAt: timestamp,
        })
        expect(result.data?.createMessage.createdAt).toBeString()
        expect(result.data?.createMessage.updatedAt).toBeString()

        const row = await db.query.messages.findFirst({
            where: (message, { eq }) => eq(message.id, id),
        })

        expect(row).toBeDefined()
        expect(row?.content).toBe("hello integration")
    })
})
