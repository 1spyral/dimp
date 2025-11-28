import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .catch("development"),

    PORT: z.coerce.number().default(3000),

    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).catch("info"),

    DB_URL: z.string().url(),
    DB_MAX_CONNECTIONS: z.coerce.number().default(10),
    DB_IDLE_TIMEOUT: z.coerce.number().default(30),
    DB_CONNECT_TIMEOUT: z.coerce.number().default(30),

    OPENAI_API_KEY: z.string().optional(),
})

export const env = envSchema.parse(process.env)
