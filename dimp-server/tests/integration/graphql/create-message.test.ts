import { db } from "@/drizzle"
import { defaultGuildSoulContent, getGuildSoulPath } from "@/guilds/soul"
import { describe, expect, test } from "bun:test"
import { rm } from "node:fs/promises"
import { dirname } from "node:path"
import { graphqlRequest } from "../helpers"

describe("integration: GraphQL createMessage", () => {
    test("creates a message, upserts the guild, and seeds a soul file", async () => {
        const id = "it-create-message-1"
        const guildId = "it-guild-1"
        const guildSoulPath = getGuildSoulPath(guildId)
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
                guildId,
                guildName: "Integration Guild",
                channelId: "c-1",
                userId: "u-1",
                content: "hello integration",
                discordCreatedAt: timestamp,
                discordUpdatedAt: timestamp,
            },
        })

        try {
            expect(result.errors).toBeUndefined()
            expect(result.data?.createMessage).toMatchObject({
                id,
                content: "hello integration",
                guildId,
                channelId: "c-1",
                userId: "u-1",
                discordCreatedAt: timestamp,
                discordUpdatedAt: timestamp,
            })
            expect(result.data?.createMessage.createdAt).toBeString()
            expect(result.data?.createMessage.updatedAt).toBeString()

            const messageRow = await db.query.messages.findFirst({
                where: (message, { eq }) => eq(message.id, id),
            })
            const guildRow = await db.query.guilds.findFirst({
                where: (guild, { eq }) => eq(guild.id, guildId),
            })

            expect(messageRow).toBeDefined()
            expect(messageRow?.content).toBe("hello integration")
            expect(guildRow).toMatchObject({
                id: guildId,
                name: "Integration Guild",
            })
            expect(await Bun.file(guildSoulPath).text()).toBe(
                defaultGuildSoulContent
            )
        } finally {
            await rm(dirname(guildSoulPath), {
                recursive: true,
                force: true,
            })
        }
    })
})
