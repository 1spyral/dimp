import { Type, type Static } from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value"

const nodeEnvs = ["development", "production", "test"] as const
const logLevels = ["debug", "info", "warn", "error"] as const

const envSchema = Type.Object(
    {
        NODE_ENV: Type.Union(
            nodeEnvs.map(value => Type.Literal(value)),
            { default: "development" }
        ),
        PORT: Type.Number({ default: 3000 }),
        HOST: Type.String({ default: "0.0.0.0" }),
        LOG_LEVEL: Type.Union(
            logLevels.map(value => Type.Literal(value)),
            { default: "info" }
        ),
        JWKS_FILE: Type.String({ default: "keys/jwks.json" }),
        DISCORD_CLIENT_ID: Type.String(),
        DISCORD_OAUTH_TOKEN: Type.String(),
        DISCORD_OAUTH_REDIRECT_URI: Type.String(),
        DISCORD_OAUTH_REDIRECT_SUCCESS_URI: Type.String(),
        DATABASE_URL: Type.String(),
        DB_MAX_CONNECTIONS: Type.Number({ default: 10 }),
        DB_IDLE_TIMEOUT: Type.Number({ default: 30 }),
        DB_CONNECT_TIMEOUT: Type.Number({ default: 30 }),
        JWT_ISSUER: Type.String({ default: "dimp-auth" }),
        JWT_ACCESS_TTL_SECONDS: Type.Integer({
            default: 900,
            minimum: 1,
        }),
        JWT_REFRESH_TTL_SECONDS: Type.Integer({
            default: 60 * 60 * 24 * 30,
            minimum: 1,
        }),
    },
    { additionalProperties: false }
)

type Env = Static<typeof envSchema>

const parseEnum = <T extends readonly string[]>(
    value: unknown,
    options: T,
    fallback: T[number]
): T[number] =>
    typeof value === "string" && options.includes(value as T[number])
        ? (value as T[number])
        : fallback

const parseString = (value: unknown, label: string): string => {
    if (typeof value !== "string") {
        throw new Error(`Missing ${label}`)
    }

    return value
}

const parseStringWithDefault = (
    value: unknown,
    label: string,
    fallback: string
): string => (value === undefined ? fallback : parseString(value, label))

const parseUrl = (value: unknown, label: string): string => {
    const parsed = parseString(value, label)

    try {
        new URL(parsed)
    } catch {
        throw new Error(`Invalid ${label}`)
    }

    return parsed
}

const parseNumber = (
    value: unknown,
    label: string,
    fallback?: number,
    options?: { integer?: boolean; positive?: boolean }
): number => {
    if (value === undefined) {
        if (fallback !== undefined) {
            return fallback
        }

        throw new Error(`Missing ${label}`)
    }

    const parsed = typeof value === "number" ? value : Number(String(value))

    if (!Number.isFinite(parsed)) {
        throw new Error(`Invalid ${label}`)
    }

    if (options?.integer && !Number.isInteger(parsed)) {
        throw new Error(`Invalid ${label}`)
    }

    if (options?.positive && parsed <= 0) {
        throw new Error(`Invalid ${label}`)
    }

    return parsed
}

const parseEnv = (input: Record<string, unknown>): Env => {
    const parsed: Env = {
        NODE_ENV: parseEnum(input.NODE_ENV, nodeEnvs, "development"),
        PORT: parseNumber(input.PORT, "PORT", 3000),
        HOST: parseStringWithDefault(input.HOST, "HOST", "0.0.0.0"),
        LOG_LEVEL: parseEnum(input.LOG_LEVEL, logLevels, "info"),
        JWKS_FILE: parseStringWithDefault(
            input.JWKS_FILE,
            "JWKS_FILE",
            "keys/jwks.json"
        ),
        DISCORD_CLIENT_ID: parseString(
            input.DISCORD_CLIENT_ID,
            "DISCORD_CLIENT_ID"
        ),
        DISCORD_OAUTH_TOKEN: parseString(
            input.DISCORD_OAUTH_TOKEN,
            "DISCORD_OAUTH_TOKEN"
        ),
        DISCORD_OAUTH_REDIRECT_URI: parseUrl(
            input.DISCORD_OAUTH_REDIRECT_URI,
            "DISCORD_OAUTH_REDIRECT_URI"
        ),
        DISCORD_OAUTH_REDIRECT_SUCCESS_URI: parseUrl(
            input.DISCORD_OAUTH_REDIRECT_SUCCESS_URI,
            "DISCORD_OAUTH_REDIRECT_SUCCESS_URI"
        ),
        DATABASE_URL: parseUrl(input.DATABASE_URL, "DATABASE_URL"),
        DB_MAX_CONNECTIONS: parseNumber(
            input.DB_MAX_CONNECTIONS,
            "DB_MAX_CONNECTIONS",
            10
        ),
        DB_IDLE_TIMEOUT: parseNumber(
            input.DB_IDLE_TIMEOUT,
            "DB_IDLE_TIMEOUT",
            30
        ),
        DB_CONNECT_TIMEOUT: parseNumber(
            input.DB_CONNECT_TIMEOUT,
            "DB_CONNECT_TIMEOUT",
            30
        ),
        JWT_ISSUER: parseStringWithDefault(
            input.JWT_ISSUER,
            "JWT_ISSUER",
            "dimp-auth"
        ),
        JWT_ACCESS_TTL_SECONDS: parseNumber(
            input.JWT_ACCESS_TTL_SECONDS,
            "JWT_ACCESS_TTL_SECONDS",
            900,
            { integer: true, positive: true }
        ),
        JWT_REFRESH_TTL_SECONDS: parseNumber(
            input.JWT_REFRESH_TTL_SECONDS,
            "JWT_REFRESH_TTL_SECONDS",
            60 * 60 * 24 * 30,
            { integer: true, positive: true }
        ),
    }

    if (!Value.Check(envSchema, parsed)) {
        throw new Error("Invalid environment configuration")
    }

    return parsed
}

export const env = parseEnv(process.env)
