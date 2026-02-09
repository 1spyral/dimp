import { client } from "@/app"
import { api } from "@/graphql"
import { logger } from "@/logger"
import { Events } from "discord.js"

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
