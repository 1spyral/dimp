import {
    Collection,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js"
import path from "path"
import { fileURLToPath } from "url"
import { glob } from "glob"

interface Command {
    data: SlashCommandBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

const collection = new Collection<string, Command>()

// Load commands
const foldersPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "commands"
)
const commandFiles = await glob(`${foldersPath}/**/*.ts`)

for (const file of commandFiles) {
    const command = await import(file)
    if ("data" in command && "execute" in command) {
        collection.set(command.data.name, command)
    } else {
        console.log(
            `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`
        )
    }
}

export { collection as commands }
