import { env } from "@/env"
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

await import("@/listeners")

client.login(env.DISCORD_TOKEN)
