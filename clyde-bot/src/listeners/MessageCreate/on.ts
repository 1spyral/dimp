import { Events } from "discord.js"
import { api } from "@/graphql"
import { client } from "@/app"

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
