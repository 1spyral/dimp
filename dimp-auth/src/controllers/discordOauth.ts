import type { RouteHandler } from "fastify"
import { env } from "@/env"
import { exchangeDiscordToken, fetchDiscordUser } from "@/services/discordOauth"
import { db } from "@/drizzle"
import { oauthTokens } from "@/db/schema"
import { and, eq } from "drizzle-orm"

const discordScopes = ["identify", "guilds"]

export const discordOauthStart: RouteHandler<{
    Querystring: { state?: string }
}> = async (request, reply) => {
    const state = request.query.state ?? ""
    const params = new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        redirect_uri: env.DISCORD_OAUTH_REDIRECT_URI,
        response_type: "code",
        scope: discordScopes.join(" "),
    })

    if (state) {
        params.set("state", state)
    }

    return reply
        .code(302)
        .header("Location", `https://discord.com/oauth2/authorize?${params}`)
        .send()
}

export const discordOauthCallback: RouteHandler<{
    Querystring: { code?: string }
}> = async (request, reply) => {
    const code = request.query.code
    if (!code) {
        return reply.code(400).send({ error: "missing_code" })
    }

    // Fetch access token from Discord
    const tokenResult = await exchangeDiscordToken(code)
    if (!tokenResult.ok) {
        request.log.warn(
            { errorBody: tokenResult.errorBody },
            "Discord token exchange failed"
        )
        return reply.code(502).send({ error: "token_exchange_failed" })
    }

    // Fetch user profile from Discord
    const userResult = await fetchDiscordUser(tokenResult.token)
    if (!userResult.ok) {
        request.log.warn(
            { userOk: userResult.ok },
            "Discord profile fetch failed"
        )
        return reply.code(502).send({ error: "profile_fetch_failed" })
    }

    const user = userResult.user as { id?: string }
    const userId = user.id
    if (!userId) {
        request.log.warn("Discord user id missing from profile response")
        return reply.code(502).send({ error: "profile_fetch_failed" })
    }

    // Upsert OAuth token in database
    const updated = await db
        .update(oauthTokens)
        .set({ accessToken: tokenResult.token.access_token })
        .where(
            and(
                eq(oauthTokens.userId, userId),
                eq(oauthTokens.oauthProvider, "discord")
            )
        )
        .returning({ id: oauthTokens.id })

    if (updated.length === 0) {
        await db.insert(oauthTokens).values({
            userId,
            accessToken: tokenResult.token.access_token,
            oauthProvider: "discord",
        })
    }

    return reply.code(200).send({
        userId,
    })
}
