import { client } from "@/app"
import { api } from "@/graphql"
import { logger } from "@/logger"
import { Events } from "discord.js"

// TODO: be picker with messages (ignore system messages)

// Write message to backend
client.on(Events.MessageCreate, async message => {
    // Ignore system messages
    if (message.system) return

    const [upsertUserResult, createMessageResult] = await Promise.allSettled([
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
            discordCreatedAt: message.createdAt,
            content: message.content,
        }),
    ])

    if (upsertUserResult.status === "rejected") {
        logger.warn(`Failed to upsert user: ${upsertUserResult.reason}`)
    }

    if (createMessageResult.status === "rejected") {
        logger.warn(`Failed to create message: ${createMessageResult.reason}`)
    }
})

// Respond to mentions
client.on(Events.MessageCreate, async message => {
    // Ignore system messages
    if (message.system) return

    try {
        if (
            message.mentions.has(client.user!.id) &&
            message.author !== client.user
        ) {
            await message.channel.sendTyping()

            const response = await api.generateChatResponse({
                id: message.id,
                userId: message.author.id,
                channelId: message.channelId,
                guildId: message.guildId!, // TODO: handle DMs
                content: message.content,
            })

            const replyContent = response.generateChatResponse
            const maxLength = 2000

            if (replyContent.length <= maxLength) {
                await message.reply(replyContent)
                return
            }

            // Discord messages must not exceed 2000 characters; chunk and send sequentially.
            for (let i = 0; i < replyContent.length; i += maxLength) {
                const chunk = replyContent.slice(i, i + maxLength)
                if (i === 0) {
                    await message.reply(chunk)
                } else {
                    await message.channel.send(chunk)
                }
            }
        }
    } catch (error) {
        logger.error(`Failed to generate chat response: ${error}`)
    }
})
