import { client } from "@/app"
import { commands } from "@/commands"
import { logger } from "@/logger"
import { Events } from "discord.js"

// Log when the client is ready
client.once(Events.ClientReady, c => {
    logger.info(`Logged in as ${c.user?.tag}`)
    logger.info(`${commands.size} commands loaded.`)
})
