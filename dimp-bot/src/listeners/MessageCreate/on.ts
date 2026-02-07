import { Events } from "discord.js"
import { api } from "@/graphql"
import { client } from "@/app"
import { logger } from "@/logger"

// TODO: be picker with messages (ignore system messages)

// Write message to backend
client.on(Events.MessageCreate, async message => {
    // Ignore system messages
    if (message.system) return

    try {
        await api.createMessage({
            id: message.id,
            userId: message.author.id,
            channelId: message.channelId,
            guildId: message.guildId!, // TODO: handle DMs
            discordCreatedAt: message.createdAt,
            content: message.content,
        })
    } catch (error) {
        logger.error(`Failed to create message: ${error}`)
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
