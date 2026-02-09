import {
    discordOauthCallback,
    discordOauthStart,
} from "@/controllers/discordOauth"
import { refreshAccessToken } from "@/controllers/refresh"
import type { FastifyInstance } from "fastify"

export const oauthRoutes = async (fastify: FastifyInstance) => {
    fastify.get("/discord", discordOauthStart)
    fastify.get("/discord/callback", discordOauthCallback)

    fastify.post("/refresh", refreshAccessToken)
}
