import { Events } from "discord.js"
import { client } from "@/app"
import { commands } from "@/commands"

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user?.tag}`)
    console.log(`${commands.size} commands loaded.`)
})
