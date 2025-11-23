import { Client, MessageFlags, Events, GatewayIntentBits } from "discord.js"
import { commands } from "@/commands"
import { env } from "@/env"
import { api } from "@/graphql"

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
})

client.on(Events.MessageCreate, async message => {
    await api.createMessage({
        id: message.id,
        userId: message.author.id,
        channelId: message.channelId,
        guildId: message.guildId!, // TODO: handle DMs
        discordCreatedAt: message.createdAt,
        discordUpdatedAt: message.createdAt,
        content: message.content,
    })
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
