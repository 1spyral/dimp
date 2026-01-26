import type { RouteHandler } from "fastify"
import { env } from "@/env"

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

    const tokenParams = new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_OAUTH_TOKEN,
        grant_type: "authorization_code",
        code,
        redirect_uri: env.DISCORD_OAUTH_REDIRECT_URI,
    })

    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenParams.toString(),
    })

    if (!tokenResponse.ok) {
        const errorBody = await tokenResponse.text()
        request.log.warn({ errorBody }, "Discord token exchange failed")
        return reply.code(502).send({ error: "token_exchange_failed" })
    }

    const tokenJson = (await tokenResponse.json()) as {
        access_token: string
        token_type: string
        expires_in: number
        refresh_token?: string
        scope: string
    }

    const authHeader = `${tokenJson.token_type} ${tokenJson.access_token}`
    const [userResponse, guildsResponse] = await Promise.all([
        fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: authHeader },
        }),
        fetch("https://discord.com/api/users/@me/guilds", {
            headers: { Authorization: authHeader },
        }),
    ])

    if (!userResponse.ok || !guildsResponse.ok) {
        request.log.warn(
            {
                userOk: userResponse.ok,
                guildsOk: guildsResponse.ok,
            },
            "Discord profile fetch failed"
        )
        return reply.code(502).send({ error: "profile_fetch_failed" })
    }

    const [user, guilds] = await Promise.all([
        userResponse.json(),
        guildsResponse.json(),
    ])

    return reply.code(200).send({
        accessToken: tokenJson.access_token,
        expiresIn: tokenJson.expires_in,
        scope: tokenJson.scope,
        user,
        guilds,
    })
}
