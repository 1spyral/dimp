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
        LOG_LEVEL: Type.Union(
            logLevels.map(value => Type.Literal(value)),
            { default: "info" }
        ),
        DISCORD_CLIENT_ID: Type.String(),
        DISCORD_TOKEN: Type.String(),
        GRAPHQL_API_URL: Type.String(),
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

const parseUrl = (value: unknown, label: string): string => {
    const parsed = parseString(value, label)

    try {
        new URL(parsed)
    } catch {
        throw new Error(`Invalid ${label}`)
    }

    return parsed
}

const parseEnv = (input: Record<string, unknown>): Env => {
    const parsed: Env = {
        NODE_ENV: parseEnum(input.NODE_ENV, nodeEnvs, "development"),
        LOG_LEVEL: parseEnum(input.LOG_LEVEL, logLevels, "info"),
        DISCORD_CLIENT_ID: parseString(
            input.DISCORD_CLIENT_ID,
            "DISCORD_CLIENT_ID"
        ),
        DISCORD_TOKEN: parseString(input.DISCORD_TOKEN, "DISCORD_TOKEN"),
        GRAPHQL_API_URL: parseUrl(input.GRAPHQL_API_URL, "GRAPHQL_API_URL"),
    }

    if (!Value.Check(envSchema, parsed)) {
        throw new Error("Invalid environment configuration")
    }

    return parsed
}

export const env = parseEnv(process.env)
