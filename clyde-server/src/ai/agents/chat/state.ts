import { z } from "zod"

const DiscordMessageSchema = z.object({})

export const ChatState = z.object({
    history: z.array(z.string()),
    message: z.string(),

    response: z.string().optional(),
})

export type ChatStateType = z.infer<typeof ChatState>
