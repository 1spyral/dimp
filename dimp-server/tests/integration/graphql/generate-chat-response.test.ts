import type { ChatStateType } from "@/ai/workflows/chat"
import { env } from "@/env"
import { beforeEach, describe, expect, mock, test } from "bun:test"
import { graphqlRequest, seedGuild, seedMessage, seedUser } from "../helpers"

let invokeImpl: (state: ChatStateType) => Promise<ChatStateType>
let capturedState: ChatStateType | undefined

mock.module("@/ai/workflows", () => ({
    chatWorkflow: {
        invoke: async (state: ChatStateType) => await invokeImpl(state),
    },
}))

describe("integration: GraphQL generateChatResponse", () => {
    beforeEach(() => {
        capturedState = undefined
        invokeImpl = async state => {
            capturedState = state
            return {
                ...state,
                response: "stubbed integration response",
            }
        }
    })

    test("builds chat state from prior channel history and returns workflow response", async () => {
        await seedGuild({ id: "g-1", name: "guild one" })
        await seedUser({ id: "u-older-1", username: "alice" })
        await seedUser({ id: "u-current", username: "carol" })
        await seedMessage({
            id: "100",
            guildId: "g-1",
            channelId: "c-1",
            userId: "u-older-1",
            content: "first",
        })
        await seedMessage({
            id: "200",
            guildId: "g-1",
            channelId: "c-1",
            userId: "u-older-2",
            content: "second",
        })
        await seedMessage({
            id: "300",
            guildId: "g-1",
            channelId: "c-1",
            userId: "u-newer",
            content: "should be excluded",
        })
        await seedMessage({
            id: "150",
            guildId: "g-2",
            channelId: "c-1",
            userId: "u-other-guild",
            content: "other guild",
        })
        await seedMessage({
            id: "175",
            guildId: "g-1",
            channelId: "c-2",
            userId: "u-other-channel",
            content: "other channel",
        })

        const mutation = `
            mutation GenerateChatResponse($input: GenerateChatResponseInput!) {
                generateChatResponse(input: $input)
            }
        `

        const result = await graphqlRequest<{
            generateChatResponse: string
        }>(mutation, {
            input: {
                id: "250",
                guildId: "g-1",
                channelId: "c-1",
                userId: "u-current",
                content: "current message",
            },
        })

        expect(result.errors).toBeUndefined()
        expect(result.data?.generateChatResponse).toBe(
            "stubbed integration response"
        )
        expect(capturedState).toEqual({
            soul: "you are a quirky and helpful Discord user.",
            history: [
                { content: "first", user: "u-older-1", username: "alice" },
                { content: "second", user: "u-older-2", username: undefined },
            ],
            message: {
                content: "current message",
                user: "u-current",
                username: "carol",
            },
        })
    })

    test("keeps bot history unprefixed while prefixing known human usernames", async () => {
        await seedGuild({ id: "g-1", name: "guild one" })
        await seedUser({ id: "u-human", username: "dave" })
        await seedMessage({
            id: "100",
            guildId: "g-1",
            channelId: "c-1",
            userId: env.DISCORD_CLIENT_ID,
            content: "bot reply",
        })

        const mutation = `
            mutation GenerateChatResponse($input: GenerateChatResponseInput!) {
                generateChatResponse(input: $input)
            }
        `

        const result = await graphqlRequest<{
            generateChatResponse: string
        }>(mutation, {
            input: {
                id: "250",
                guildId: "g-1",
                channelId: "c-1",
                userId: "u-human",
                content: "follow up",
            },
        })

        expect(result.errors).toBeUndefined()
        expect(result.data?.generateChatResponse).toBe(
            "stubbed integration response"
        )
        expect(capturedState).toEqual({
            soul: "you are a quirky and helpful Discord user.",
            history: [
                {
                    content: "bot reply",
                    user: env.DISCORD_CLIENT_ID,
                    username: undefined,
                },
            ],
            message: {
                content: "follow up",
                user: "u-human",
                username: "dave",
            },
        })
    })

    test("returns a GraphQL error when workflow invocation fails", async () => {
        await seedGuild({ id: "g-1", name: "guild one" })
        invokeImpl = async () => {
            throw new Error("workflow boom")
        }

        const mutation = `
            mutation GenerateChatResponse($input: GenerateChatResponseInput!) {
                generateChatResponse(input: $input)
            }
        `

        const result = await graphqlRequest<{
            generateChatResponse: string
        }>(mutation, {
            input: {
                id: "500",
                guildId: "g-1",
                channelId: "c-1",
                userId: "u-current",
                content: "current message",
            },
        })

        expect(result.data).toBeNull()
        expect(result.errors?.[0]?.message).toBe(
            "Failed to generate chat response"
        )
    })
})
