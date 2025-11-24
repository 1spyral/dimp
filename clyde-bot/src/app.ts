import { Client, GatewayIntentBits } from "discord.js"
import { env } from "@/env"

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
})

await import("@/listeners")

client.login(env.DISCORD_TOKEN)
