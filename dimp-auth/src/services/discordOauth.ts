import { env } from "@/env"

export type DiscordToken = {
    access_token: string
    token_type: string
    expires_in: number
    refresh_token?: string
    scope: string
}

type TokenExchangeResult =
    | { ok: true; token: DiscordToken }
    | { ok: false; errorBody: string }

type UserFetchResult = { ok: true; user: unknown } | { ok: false }
type GuildsFetchResult = { ok: true; guilds: unknown } | { ok: false }

export const exchangeDiscordToken = async (
    code: string
): Promise<TokenExchangeResult> => {
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
        return { ok: false, errorBody: await tokenResponse.text() }
    }

    return { ok: true, token: (await tokenResponse.json()) as DiscordToken }
}

export const fetchDiscordUser = async (
    token: DiscordToken
): Promise<UserFetchResult> => {
    const authHeader = `${token.token_type} ${token.access_token}`
    const response = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: authHeader },
    })

    if (!response.ok) {
        return { ok: false }
    }

    return { ok: true, user: await response.json() }
}

export const fetchDiscordGuilds = async (
    token: DiscordToken
): Promise<GuildsFetchResult> => {
    const authHeader = `${token.token_type} ${token.access_token}`
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: authHeader },
    })

    if (!response.ok) {
        return { ok: false }
    }

    return { ok: true, guilds: await response.json() }
}
