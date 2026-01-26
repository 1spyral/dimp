import type { FastifyReply } from "fastify"
import { env } from "@/env"

export const REFRESH_COOKIE_NAME = "refresh_token"

export const setRefreshCookie = (
    reply: FastifyReply,
    refreshToken: string,
    expiresAt: Date
): void => {
    reply.setCookie(REFRESH_COOKIE_NAME, refreshToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: env.JWT_REFRESH_TTL_SECONDS,
        expires: expiresAt,
        secure: env.NODE_ENV === "production",
    })
}
