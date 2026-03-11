import type { Command } from "@/commands"
import { createInteractionCreateHandler } from "@/listeners/InteractionCreate/on"
import { describe, expect, mock, test } from "bun:test"
import { MessageFlags, SlashCommandBuilder } from "discord.js"

const createInteraction = (overrides: Partial<Record<string, unknown>> = {}) =>
    ({
        commandName: "ping",
        deferred: false,
        replied: false,
        isChatInputCommand: () => true,
        reply: mock(async () => {}),
        followUp: mock(async () => {}),
        ...overrides,
    }) as unknown

const createCommand = (execute: Command["execute"]): Command => ({
    data: new SlashCommandBuilder().setName("ping").setDescription("Ping"),
    execute,
})

describe("InteractionCreate", () => {
    test("ignores non-chat-input interactions", async () => {
        const logger = { error: mock(() => {}) }
        const handler = createInteractionCreateHandler({
            commands: new Map(),
            logger,
        })
        const interaction = createInteraction({
            isChatInputCommand: () => false,
        })

        await handler(interaction)

        expect(logger.error).not.toHaveBeenCalled()
        expect(interaction.reply).not.toHaveBeenCalled()
    })

    test("logs when a command is missing", async () => {
        const logger = { error: mock(() => {}) }
        const handler = createInteractionCreateHandler({
            commands: new Map(),
            logger,
        })

        await handler(createInteraction())

        expect(logger.error).toHaveBeenCalledWith(
            "No command matching ping was found."
        )
    })

    test("executes a known command", async () => {
        const execute = mock(async () => {})
        const handler = createInteractionCreateHandler({
            commands: new Map([["ping", createCommand(execute)]]),
            logger: { error: mock(() => {}) },
        })
        const interaction = createInteraction()

        await handler(interaction)

        expect(execute).toHaveBeenCalledWith(interaction)
    })

    test("replies with an ephemeral error when command execution fails before a reply", async () => {
        const handler = createInteractionCreateHandler({
            commands: new Map([
                [
                    "ping",
                    createCommand(async () => {
                        throw new Error("boom")
                    }),
                ],
            ]),
            logger: { error: mock(() => {}) },
        })
        const interaction = createInteraction()

        await handler(interaction)

        expect(interaction.reply).toHaveBeenCalledWith({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
        })
        expect(interaction.followUp).not.toHaveBeenCalled()
    })

    test("uses followUp when command execution fails after a reply", async () => {
        const handler = createInteractionCreateHandler({
            commands: new Map([
                [
                    "ping",
                    createCommand(async () => {
                        throw new Error("boom")
                    }),
                ],
            ]),
            logger: { error: mock(() => {}) },
        })
        const interaction = createInteraction({
            replied: true,
        })

        await handler(interaction)

        expect(interaction.followUp).toHaveBeenCalledWith({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
        })
        expect(interaction.reply).not.toHaveBeenCalled()
    })
})
