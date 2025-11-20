import { z } from "zod"

const envSchema = z.object({
    DISCORD_TOKEN: z.string(),
    DISCORD_CLIENT_ID: z.string(),
})

export const env = envSchema.parse(process.env)
