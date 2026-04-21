import { serializeErrorForLogging } from "@/logger"
import type { Message } from "discord.js"

type BotApi = {
    upsertUser: (input: {
        id: string
        username: string
        discriminator: string
    }) => Promise<unknown>
    createMessage: (input: {
        id: string
        userId: string
        channelId: string
        guildId: string
        guildName: string
        discordCreatedAt: Date
        content: string
    }) => Promise<unknown>
    generateChatResponse: (input: {
        id: string
        userId: string
        channelId: string
        guildId: string
        content: string
    }) => Promise<{
        generateChatResponse: string
    }>
}

type BotLogger = {
    warn: (payload: unknown, message?: string) => void
    error: (payload: unknown, message?: string) => void
}

type MessageCreateDependencies = {
    api: BotApi
    logger: BotLogger
}

type MentionResponseDependencies = MessageCreateDependencies & {
    getBotUserId: () => string
}

const logRejectedResult = (
    logger: BotLogger,
    action: string,
    result: PromiseSettledResult<unknown>
) => {
    if (result.status === "rejected") {
        logger.warn(
            { error: serializeErrorForLogging(result.reason) },
            `Failed to ${action}`
        )
    }
}

const sendReplyContent = async (
    message: Pick<Message, "reply" | "channel">,
    replyContent: string
) => {
    const maxLength = 2000

    if (replyContent.length <= maxLength) {
        await message.reply(replyContent)
        return
    }

    for (let i = 0; i < replyContent.length; i += maxLength) {
        const chunk = replyContent.slice(i, i + maxLength)
        if (i === 0) {
            await message.reply(chunk)
        } else {
            await message.channel.send(chunk)
        }
    }
}

export const createPersistMessageHandler =
    ({ api, logger }: MessageCreateDependencies) =>
    async (message: Message) => {
        if (message.system) return

        const [upsertUserResult, createMessageResult] =
            await Promise.allSettled([
                api.upsertUser({
                    id: message.author.id,
                    username: message.author.username,
                    discriminator: message.author.discriminator,
                }),
                api.createMessage({
                    id: message.id,
                    userId: message.author.id,
                    channelId: message.channelId,
                    guildId: message.guildId!, // TODO: handle DMs
                    guildName: message.guild!.name, // TODO: handle DMs
                    discordCreatedAt: message.createdAt,
                    content: message.content,
                }),
            ])

        logRejectedResult(logger, "upsert user", upsertUserResult)
        logRejectedResult(logger, "create message", createMessageResult)
    }

export const createMentionResponseHandler =
    ({ api, logger, getBotUserId }: MentionResponseDependencies) =>
    async (message: Message) => {
        if (message.system) return

        const botUserId = getBotUserId()
        if (
            !message.mentions.has(botUserId) ||
            message.author.id === botUserId
        ) {
            return
        }

        try {
            await message.channel.sendTyping()

            const response = await api.generateChatResponse({
                id: message.id,
                userId: message.author.id,
                channelId: message.channelId,
                guildId: message.guildId!, // TODO: handle DMs
                content: message.content,
            })

            await sendReplyContent(message, response.generateChatResponse)
        } catch (error) {
            logger.error(
                { error: serializeErrorForLogging(error) },
                "Failed to generate chat response"
            )
        }
    }
