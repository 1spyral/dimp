import { client } from "@/app"
import { api } from "@/graphql"
import { logger } from "@/logger"
import { Events } from "discord.js"
import { createMentionResponseHandler, createPersistMessageHandler } from "./on"

client.on(Events.MessageCreate, createPersistMessageHandler({ api, logger }))
client.on(
    Events.MessageCreate,
    createMentionResponseHandler({
        api,
        logger,
        getBotUserId: () => client.user!.id,
    })
)
