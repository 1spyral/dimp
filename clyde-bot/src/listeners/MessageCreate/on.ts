import { Events } from "discord.js"
import { api } from "@/graphql"
import { client } from "@/app"
import { logger } from "@/logger"

// TODO: be picker with messages (ignore system messages)

// Write message to backend
client.on(Events.MessageCreate, async message => {
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

            await message.reply(response.generateChatResponse)
        }
    } catch (error) {
        logger.error(`Failed to generate chat response: ${error}`)
    }
})
