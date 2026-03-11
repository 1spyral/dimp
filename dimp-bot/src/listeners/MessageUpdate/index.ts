import { client } from "@/app"
import { api } from "@/graphql"
import { logger } from "@/logger"
import { Events } from "discord.js"
import { createMessageUpdateHandler } from "./on"

client.on(Events.MessageUpdate, createMessageUpdateHandler({ api, logger }))
