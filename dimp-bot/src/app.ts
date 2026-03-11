import { env } from "@/env"
import { startHealthcheckServer } from "@/healthcheck"
import { logger } from "@/logger"
import { Client, GatewayIntentBits } from "discord.js"

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
})

let shuttingDown = false

const healthcheckServer = startHealthcheckServer({
    isLive: () => !shuttingDown,
    isReady: () => client.isReady() && !shuttingDown,
})

const shutdown = (signal: NodeJS.Signals) => {
    if (shuttingDown) {
        return
    }

    shuttingDown = true
    logger.info({ signal }, "Shutting down dimp-bot")

    healthcheckServer.stop()
    client.destroy()

    process.exit(0)
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => shutdown(signal))
}

await import("@/listeners")

try {
    await client.login(env.DISCORD_TOKEN)
} catch (error) {
    shuttingDown = true
    healthcheckServer.stop()
    logger.error({ error }, "Failed to log into Discord")
    process.exit(1)
}
