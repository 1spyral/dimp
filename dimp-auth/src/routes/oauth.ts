import type { FastifyInstance } from "fastify"
import {
    discordOauthCallback,
    discordOauthStart,
} from "@/controllers/discordOauth"

export const oauthRoutes = async (fastify: FastifyInstance) => {
    fastify.get("/discord", discordOauthStart)
    fastify.get("/discord/callback", discordOauthCallback)
}
