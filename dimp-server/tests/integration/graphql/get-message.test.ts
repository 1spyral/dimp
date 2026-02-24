import { describe, expect, test } from "bun:test"
import { graphqlRequest, seedMessage } from "../helpers"

describe("integration: GraphQL message query", () => {
    test("returns a message by id", async () => {
        const seeded = await seedMessage({
            id: "it-get-message-1",
            content: "query me",
            discordUpdatedAt: new Date("2025-01-01T00:07:00.000Z"),
            discordDeletedAt: new Date("2025-01-01T00:08:00.000Z"),
        })

        const getQuery = `
            query GetMessage($id: ID!) {
                message(id: $id) {
                    id
                    content
                    guildId
                    channelId
                    userId
                    discordUpdatedAt
                    discordDeletedAt
                }
            }
        `

        const result = await graphqlRequest<{
            message: {
                id: string
                content: string | null
                guildId: string
                channelId: string
                userId: string
                discordUpdatedAt: string
                discordDeletedAt: string | null
            } | null
        }>(getQuery, { id: seeded.id })

        expect(result.errors).toBeUndefined()
        expect(result.data?.message).toEqual({
            id: seeded.id,
            content: "query me",
            guildId: seeded.guildId,
            channelId: seeded.channelId,
            userId: seeded.userId,
            discordUpdatedAt: seeded.discordUpdatedAt.toISOString(),
            discordDeletedAt: seeded.discordDeletedAt?.toISOString() ?? null,
        })
    })

    test("returns null for an unknown id", async () => {
        const getQuery = `
            query GetMessage($id: ID!) {
                message(id: $id) {
                    id
                }
            }
        `

        const result = await graphqlRequest<{
            message: { id: string } | null
        }>(getQuery, { id: "missing-message-id" })

        expect(result.errors).toBeUndefined()
        expect(result.data?.message).toBeNull()
    })
})
