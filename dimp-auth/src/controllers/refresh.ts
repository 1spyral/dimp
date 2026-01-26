import type { RouteHandler } from "fastify"
import { and, eq, isNull, gt } from "drizzle-orm"

import { db } from "@/drizzle"
import { oauthRefreshTokens } from "@/db/schema"
import { JwtService, generateRefreshToken } from "@/services/jwt"
import { createHash } from "node:crypto"
import { env } from "@/env"

const hashRefreshToken = (token: string): string =>
    createHash("sha256").update(token, "utf8").digest("hex")

export const refreshAccessToken: RouteHandler<{
    Body: { refreshToken?: string }
}> = async (request, reply) => {
    const refreshToken = request.body?.refreshToken
    if (!refreshToken) {
        return reply.code(400).send({ error: "missing_refresh_token" })
    }

    const refreshTokenHash = hashRefreshToken(refreshToken)

    const now = new Date()

    const existing = await db
        .select({
            id: oauthRefreshTokens.id,
            userId: oauthRefreshTokens.userId,
            revokedAt: oauthRefreshTokens.revokedAt,
            expiresAt: oauthRefreshTokens.expiresAt,
        })
        .from(oauthRefreshTokens)
        .where(
            and(
                eq(oauthRefreshTokens.tokenHash, refreshTokenHash),
                isNull(oauthRefreshTokens.revokedAt),
                gt(oauthRefreshTokens.expiresAt, now)
            )
        )
        .limit(1)

    if (existing.length === 0) {
        return reply.code(401).send({ error: "invalid_refresh_token" })
    }

    // Rotate refresh token
    const newRefreshToken = generateRefreshToken()
    const newRefreshTokenHash = hashRefreshToken(newRefreshToken)
    const newExpiresAt = new Date(
        Date.now() + env.JWT_REFRESH_TTL_SECONDS * 1000
    )

    await db.transaction(async tx => {
        await tx
            .update(oauthRefreshTokens)
            .set({
                revokedAt: now,
                replacedByTokenHash: newRefreshTokenHash,
            })
            .where(eq(oauthRefreshTokens.id, existing[0]!.id))

        await tx.insert(oauthRefreshTokens).values({
            userId: existing[0]!.userId,
            tokenHash: newRefreshTokenHash,
            expiresAt: newExpiresAt,
        })
    })

    const jwtService = new JwtService(
        () => request.server.jwksStore.getJwks().keys
    )
    const { accessToken, expiresIn, tokenType } =
        await jwtService.issueAccessToken({
            userId: existing[0]!.userId,
            provider: "discord",
        })

    return reply.code(200).send({
        accessToken,
        expiresIn,
        tokenType,
        refreshToken: newRefreshToken,
        refreshExpiresIn: env.JWT_REFRESH_TTL_SECONDS,
        issuer: env.JWT_ISSUER,
        audience: "dimp", // TODO: differentiate based on requester
    })
}
