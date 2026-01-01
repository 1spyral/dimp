import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .catch("development"),

    PORT: z.coerce.number().default(3000),

    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).catch("info"),
})

export const env = envSchema.parse(process.env)
