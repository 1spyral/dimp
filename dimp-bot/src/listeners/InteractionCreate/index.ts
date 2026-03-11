import { client } from "@/app"
import { commands } from "@/commands"
import { logger } from "@/logger"
import { Events } from "discord.js"
import { createInteractionCreateHandler } from "./on"

client.on(
    Events.InteractionCreate,
    createInteractionCreateHandler({ commands, logger })
)
