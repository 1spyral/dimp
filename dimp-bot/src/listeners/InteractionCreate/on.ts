import type { Command } from "@/commands"
import { serializeErrorForLogging } from "@/logger"
import { MessageFlags, type BaseInteraction } from "discord.js"

type InteractionCreateDependencies = {
    commands: Pick<Map<string, Command>, "get">
    logger: {
        error: (payload: unknown, message?: string) => void
    }
}

type ChatInputInteraction = BaseInteraction & {
    commandName: string
    replied: boolean
    deferred: boolean
    isChatInputCommand: () => boolean
    reply: (options: {
        content: string
        flags: MessageFlags
    }) => Promise<unknown>
    followUp: (options: {
        content: string
        flags: MessageFlags
    }) => Promise<unknown>
}

export const createInteractionCreateHandler =
    ({ commands, logger }: InteractionCreateDependencies) =>
    async (interaction: ChatInputInteraction) => {
        if (!interaction.isChatInputCommand()) return

        const command = commands.get(interaction.commandName)
        if (!command) {
            logger.error(
                `No command matching ${interaction.commandName} was found.`
            )
            return
        }

        try {
            await command.execute(interaction)
        } catch (error) {
            logger.error(
                { error: serializeErrorForLogging(error) },
                "Failed to execute command"
            )
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
    }
