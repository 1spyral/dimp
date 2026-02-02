import { z } from "zod"

const ChatMessageSchema = z.object({
    content: z.string().nullable(),
    user: z.string().optional(),
})

export const ChatState = z.object({
    history: z.array(ChatMessageSchema),
    message: ChatMessageSchema,

    response: z.string().optional(),
})

export type ChatStateType = z.infer<typeof ChatState>
