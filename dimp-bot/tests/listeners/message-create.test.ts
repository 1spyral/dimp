import {
    createMentionResponseHandler,
    createPersistMessageHandler,
} from "@/listeners/MessageCreate/on"
import { describe, expect, mock, test } from "bun:test"

const createBaseMessage = (overrides: Partial<Record<string, unknown>> = {}) =>
    ({
        author: {
            discriminator: "1234",
            id: "user-1",
            username: "luke",
        },
        channel: {
            send: mock(async () => {}),
            sendTyping: mock(async () => {}),
        },
        channelId: "channel-1",
        content: "hello <@bot-1>",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        guildId: "guild-1",
        id: "message-1",
        mentions: {
            has: (id: string) => id === "bot-1",
        },
        reply: mock(async () => {}),
        system: false,
        ...overrides,
    }) as unknown

describe("MessageCreate persistence", () => {
    test("ignores system messages", async () => {
        const api = {
            upsertUser: mock(async () => {}),
            createMessage: mock(async () => {}),
            generateChatResponse: mock(async () => ({
                generateChatResponse: "unused",
            })),
        }
        const handler = createPersistMessageHandler({
            api,
            logger: {
                warn: mock(() => {}),
                error: mock(() => {}),
            },
        })

        await handler(createBaseMessage({ system: true }))

        expect(api.upsertUser).not.toHaveBeenCalled()
        expect(api.createMessage).not.toHaveBeenCalled()
    })

    test("writes the author and message to the backend", async () => {
        const api = {
            upsertUser: mock(async () => {}),
            createMessage: mock(async () => {}),
            generateChatResponse: mock(async () => ({
                generateChatResponse: "unused",
            })),
        }
        const logger = {
            warn: mock(() => {}),
            error: mock(() => {}),
        }
        const handler = createPersistMessageHandler({ api, logger })
        const createdAt = new Date("2024-01-01T00:00:00.000Z")

        await handler(createBaseMessage({ createdAt }))

        expect(api.upsertUser).toHaveBeenCalledWith({
            id: "user-1",
            username: "luke",
            discriminator: "1234",
        })
        expect(api.createMessage).toHaveBeenCalledWith({
            id: "message-1",
            userId: "user-1",
            channelId: "channel-1",
            guildId: "guild-1",
            discordCreatedAt: createdAt,
            content: "hello <@bot-1>",
        })
        expect(logger.warn).not.toHaveBeenCalled()
    })

    test("warns when persistence calls fail", async () => {
        const logger = {
            warn: mock(() => {}),
            error: mock(() => {}),
        }
        const handler = createPersistMessageHandler({
            api: {
                upsertUser: mock(async () => {
                    throw new Error("upsert failed")
                }),
                createMessage: mock(async () => {
                    throw new Error("create failed")
                }),
                generateChatResponse: mock(async () => ({
                    generateChatResponse: "unused",
                })),
            },
            logger,
        })

        await handler(createBaseMessage())

        expect(logger.warn).toHaveBeenCalledTimes(2)
    })
})

describe("MessageCreate mention responses", () => {
    test("ignores non-mentions", async () => {
        const api = {
            upsertUser: mock(async () => {}),
            createMessage: mock(async () => {}),
            generateChatResponse: mock(async () => ({
                generateChatResponse: "unused",
            })),
        }
        const handler = createMentionResponseHandler({
            api,
            logger: {
                warn: mock(() => {}),
                error: mock(() => {}),
            },
            getBotUserId: () => "bot-1",
        })
        const message = createBaseMessage({
            mentions: {
                has: () => false,
            },
        })

        await handler(message)

        expect(api.generateChatResponse).not.toHaveBeenCalled()
        expect(message.channel.sendTyping).not.toHaveBeenCalled()
    })

    test("ignores self-mentions", async () => {
        const api = {
            upsertUser: mock(async () => {}),
            createMessage: mock(async () => {}),
            generateChatResponse: mock(async () => ({
                generateChatResponse: "unused",
            })),
        }
        const handler = createMentionResponseHandler({
            api,
            logger: {
                warn: mock(() => {}),
                error: mock(() => {}),
            },
            getBotUserId: () => "bot-1",
        })
        const message = createBaseMessage({
            author: {
                discriminator: "0001",
                id: "bot-1",
                username: "dimp-bot",
            },
        })

        await handler(message)

        expect(api.generateChatResponse).not.toHaveBeenCalled()
    })

    test("sends typing, generates a reply, and responds once for short messages", async () => {
        const api = {
            upsertUser: mock(async () => {}),
            createMessage: mock(async () => {}),
            generateChatResponse: mock(async () => ({
                generateChatResponse: "hello back",
            })),
        }
        const handler = createMentionResponseHandler({
            api,
            logger: {
                warn: mock(() => {}),
                error: mock(() => {}),
            },
            getBotUserId: () => "bot-1",
        })
        const message = createBaseMessage()

        await handler(message)

        expect(message.channel.sendTyping).toHaveBeenCalledTimes(1)
        expect(api.generateChatResponse).toHaveBeenCalledWith({
            id: "message-1",
            userId: "user-1",
            channelId: "channel-1",
            guildId: "guild-1",
            content: "hello <@bot-1>",
        })
        expect(message.reply).toHaveBeenCalledWith("hello back")
        expect(message.channel.send).not.toHaveBeenCalled()
    })

    test("chunks long replies after the first reply", async () => {
        const api = {
            upsertUser: mock(async () => {}),
            createMessage: mock(async () => {}),
            generateChatResponse: mock(async () => ({
                generateChatResponse: "a".repeat(4500),
            })),
        }
        const handler = createMentionResponseHandler({
            api,
            logger: {
                warn: mock(() => {}),
                error: mock(() => {}),
            },
            getBotUserId: () => "bot-1",
        })
        const message = createBaseMessage()

        await handler(message)

        expect(message.reply).toHaveBeenCalledTimes(1)
        expect(message.reply.mock.calls[0]?.[0]).toHaveLength(2000)
        expect(message.channel.send).toHaveBeenCalledTimes(2)
        expect(message.channel.send.mock.calls[0]?.[0]).toHaveLength(2000)
        expect(message.channel.send.mock.calls[1]?.[0]).toHaveLength(500)
    })

    test("logs failures when generating a response", async () => {
        const logger = {
            warn: mock(() => {}),
            error: mock(() => {}),
        }
        const handler = createMentionResponseHandler({
            api: {
                upsertUser: mock(async () => {}),
                createMessage: mock(async () => {}),
                generateChatResponse: mock(async () => {
                    throw new Error("boom")
                }),
            },
            logger,
            getBotUserId: () => "bot-1",
        })

        await handler(createBaseMessage())

        expect(logger.error).toHaveBeenCalledTimes(1)
    })
})
