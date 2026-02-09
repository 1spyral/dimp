import { commands } from "@/commands"
import { REST, Routes } from "discord.js"

const clientId = process.env.DISCORD_CLIENT_ID!
const token = process.env.DISCORD_TOKEN!

const rest = new REST().setToken(token)

;(async () => {
    try {
        console.log(
            `Started refreshing ${commands.size} application (/) commands.`
        )

        const data = (await rest.put(Routes.applicationCommands(clientId), {
            body: Array.from(commands.values()).map(command =>
                command.data.toJSON()
            ),
        })) as any[]

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        )
    } catch (error) {
        console.error(error)
    }
})()
