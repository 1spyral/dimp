import { client } from "@/app"
import { commands } from "@/commands"
import { logger } from "@/logger"
import { Events } from "discord.js"
import { createClientReadyHandler } from "./once"

client.once(
    Events.ClientReady,
    createClientReadyHandler({
        getCommandCount: () => commands.size,
        logger,
    })
)
