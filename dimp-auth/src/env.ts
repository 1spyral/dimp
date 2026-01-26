import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .catch("development"),

    PORT: z.coerce.number().default(3000),
    HOST: z.string().default("0.0.0.0"),

    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).catch("info"),

    JWKS_FILE: z.string().default("keys/jwks.json"),

    DISCORD_CLIENT_ID: z.string(),
    DISCORD_OAUTH_TOKEN: z.string(),
    DISCORD_OAUTH_REDIRECT_URI: z.string().url(),

    DATABASE_URL: z.string().url(),
    DB_MAX_CONNECTIONS: z.coerce.number().default(10),
    DB_IDLE_TIMEOUT: z.coerce.number().default(30),
    DB_CONNECT_TIMEOUT: z.coerce.number().default(30),
})

export const env = envSchema.parse(process.env)
