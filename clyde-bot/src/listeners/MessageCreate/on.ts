import { Events } from "discord.js"
import { api } from "@/graphql"
import { client } from "@/app"

// TODO: be picker with messages (ignore system messages)

client.on(Events.MessageCreate, async message => {
    await api.createMessage({
        id: message.id,
        userId: message.author.id,
        channelId: message.channelId,
        guildId: message.guildId!, // TODO: handle DMs
        discordCreatedAt: message.createdAt,
        content: message.content,
    })
})

client.on(Events.MessageCreate, async message => {
    if (
        message.mentions.has(client.user!.id) &&
        message.author !== client.user
    ) {
        await message.channel.sendTyping()

        const response = await api.generateChatResponse({
            userId: message.author.id,
            channelId: message.channelId,
            guildId: message.guildId!, // TODO: handle DMs
            content: message.content,
        })

        await message.reply(response.generateChatResponse)
    }
})
