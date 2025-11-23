import { z } from "zod"

const envSchema = z.object({
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_TOKEN: z.string(),
    GRAPHQL_API_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
