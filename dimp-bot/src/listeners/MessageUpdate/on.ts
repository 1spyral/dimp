import { Events } from "discord.js"
import { api } from "@/graphql"
import { client } from "@/app"
import { logger } from "@/logger"

// Write message to backend
client.on(Events.MessageUpdate, async (_oldMessage, newMessage) => {
    // Ignore system messages
    if (newMessage.system) return

    try {
        await api.updateMessage({
            id: newMessage.id,
            content: newMessage.content || "",
            discordUpdatedAt: newMessage.editedAt,
        })
    } catch (error) {
        logger.error(`Failed to update message: ${error}`)
    }
})
