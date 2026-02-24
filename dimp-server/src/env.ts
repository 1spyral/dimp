import { Type, type Static } from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value"

const nodeEnvs = ["development", "production", "test"] as const
const logLevels = ["debug", "info", "warn", "error"] as const

export const envSchema = Type.Object(
    {
        NODE_ENV: Type.Union(
            nodeEnvs.map(value => Type.Literal(value)),
            {
                default: "development",
            }
        ),
        PORT: Type.Number({ default: 3000 }),
        HOST: Type.String({ default: "0.0.0.0" }),
        LOG_LEVEL: Type.Union(
            logLevels.map(value => Type.Literal(value)),
            {
                default: "info",
            }
        ),
        DISCORD_CLIENT_ID: Type.String(),
        DATABASE_URL: Type.String(),
        DB_MAX_CONNECTIONS: Type.Number({ default: 10 }),
        DB_IDLE_TIMEOUT: Type.Number({ default: 30 }),
        DB_CONNECT_TIMEOUT: Type.Number({ default: 30 }),
        OPENAI_API_KEY: Type.Optional(Type.String()),
        ANTHROPIC_API_KEY: Type.Optional(Type.String()),
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

const parseOptionalString = (
    value: unknown,
    label: string
): string | undefined => {
    if (value === undefined) {
        return undefined
    }

    return parseString(value, label)
}

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
    fallback?: number
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

    return parsed
}

export const parseEnv = (input: Record<string, unknown>): Env => {
    const openaiApiKey = parseOptionalString(
        input.OPENAI_API_KEY,
        "OPENAI_API_KEY"
    )
    const anthropicApiKey = parseOptionalString(
        input.ANTHROPIC_API_KEY,
        "ANTHROPIC_API_KEY"
    )
    const parsed: Env = {
        NODE_ENV: parseEnum(input.NODE_ENV, nodeEnvs, "development"),
        PORT: parseNumber(input.PORT, "PORT", 3000),
        HOST: parseStringWithDefault(input.HOST, "HOST", "0.0.0.0"),
        LOG_LEVEL: parseEnum(input.LOG_LEVEL, logLevels, "info"),
        DISCORD_CLIENT_ID: parseString(
            input.DISCORD_CLIENT_ID,
            "DISCORD_CLIENT_ID"
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
        ...(openaiApiKey !== undefined ? { OPENAI_API_KEY: openaiApiKey } : {}),
        ...(anthropicApiKey !== undefined
            ? { ANTHROPIC_API_KEY: anthropicApiKey }
            : {}),
    }

    if (!Value.Check(envSchema, parsed)) {
        throw new Error("Invalid environment configuration")
    }

    return parsed
}

export const env = parseEnv(process.env)
