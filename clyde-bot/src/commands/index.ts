import {
    Collection,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js"

interface Command {
    data: SlashCommandBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

const COMMANDS = ["./ping"]

const collection = new Collection<string, Command>()

// Load commands
for (const command of COMMANDS) {
    const { data, execute } = await import(command)
    collection.set(data.name, { data, execute })
}

export { collection as commands }
