import { SignJWT, importJWK } from "jose"
import {
    randomBytes,
    randomUUID,
    createHash,
    timingSafeEqual,
} from "node:crypto"

import type { JwksEntry } from "@/jwks"
import { env } from "@/env"

export type IssueAccessTokenParams = {
    userId: string
    provider: "discord"
}

export type IssuedToken = {
    accessToken: string
    expiresIn: number
    tokenType: "Bearer"
}

export type IssuedRefreshToken = {
    refreshToken: string
    refreshTokenHash: string
    expiresAt: Date
}

const pickActiveSigningKey = (keys: JwksEntry[]): JwksEntry => {
    const candidates = keys.filter(
        k => k.use === "sig" && k.alg === "RS256" && k.privateJwk
    )
    if (candidates.length === 0) {
        throw new Error("No usable signing keys found in JWKS")
    }

    const withDates = candidates
        .map(k => ({
            k,
            t: k.createdAt ? Date.parse(k.createdAt) : Number.NaN,
        }))
        .sort((a, b) => {
            if (Number.isNaN(a.t) && Number.isNaN(b.t)) return 0
            if (Number.isNaN(a.t)) return 1
            if (Number.isNaN(b.t)) return -1
            return b.t - a.t
        })

    return withDates[0]?.k ?? candidates[candidates.length - 1]!
}

const hashRefreshToken = (token: string): string =>
    createHash("sha256").update(token, "utf8").digest("hex")

export const refreshTokenMatchesHash = (
    token: string,
    expectedHash: string
): boolean => {
    const actual = Buffer.from(hashRefreshToken(token), "utf8")
    const expected = Buffer.from(expectedHash, "utf8")
    if (actual.length !== expected.length) return false
    return timingSafeEqual(actual, expected)
}

export const generateRefreshToken = (): string => {
    // 32 bytes => 256 bits of entropy
    return randomBytes(32).toString("base64url")
}

export class JwtService {
    constructor(private readonly getJwksEntries: () => JwksEntry[]) {}

    async issueAccessToken(
        params: IssueAccessTokenParams
    ): Promise<IssuedToken> {
        const ttlSeconds = env.JWT_ACCESS_TTL_SECONDS
        const { userId, provider } = params

        const jwkEntry = pickActiveSigningKey(this.getJwksEntries())
        const privateKey = await importJWK(jwkEntry.privateJwk!, "RS256")

        const accessToken = await new SignJWT({ provider })
            .setProtectedHeader({ alg: "RS256", kid: jwkEntry.kid, typ: "JWT" })
            .setIssuer(env.JWT_ISSUER)
            .setAudience("dimp") // TODO: differentiate based on requester
            .setSubject(userId)
            .setJti(randomUUID())
            .setIssuedAt()
            .setExpirationTime(`${ttlSeconds}s`)
            .sign(privateKey)

        return {
            accessToken,
            expiresIn: ttlSeconds,
            tokenType: "Bearer",
        }
    }

    issueRefreshToken(): IssuedRefreshToken {
        const refreshToken = generateRefreshToken()
        const refreshTokenHash = hashRefreshToken(refreshToken)
        const expiresAt = new Date(
            Date.now() + env.JWT_REFRESH_TTL_SECONDS * 1000
        )

        return { refreshToken, refreshTokenHash, expiresAt }
    }
}
