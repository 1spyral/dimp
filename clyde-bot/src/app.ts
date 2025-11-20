import { Client, MessageFlags, Events, GatewayIntentBits } from "discord.js"
import { commands } from "./commands.ts"
import { env } from "./env"

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
})

// TODO: offload to separate command handler module
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return
    const command = commands.get(interaction.commandName)
    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`
        )
        return
    }
    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                flags: MessageFlags.Ephemeral,
            })
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                flags: MessageFlags.Ephemeral,
            })
        }
    }
})

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user?.tag}`)
})

client.login(env.DISCORD_TOKEN)
