import { REST, Routes } from "discord.js"
import path from "path"
import { fileURLToPath } from "url"
import { glob } from "glob"

const clientId = process.env.DISCORD_CLIENT_ID!
const token = process.env.DISCORD_TOKEN!

export const commands: any[] = []

// Load commands
const foldersPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "commands"
)
const commandFiles = await glob(`${foldersPath}/**/*.ts`)

for (const file of commandFiles) {
    const command = await import(file)
    if ("data" in command) {
        commands.push(command.data.toJSON())
    } else {
        console.log(
            `[WARNING] The command at ${file} is missing required "data" property.`
        )
    }
}

// Upload commands
const rest = new REST().setToken(token)

;(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        )

        const data = (await rest.put(Routes.applicationCommands(clientId), {
            body: commands,
        })) as any[]

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        )
    } catch (error) {
        console.error(error)
    }
})()
