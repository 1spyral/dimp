import { serializeErrorForLogging } from "@/logger"
import type { Message } from "discord.js"

type UpdateMessageDependencies = {
    api: {
        updateMessage: (input: {
            id: string
            content: string
            discordUpdatedAt: Date | null
        }) => Promise<unknown>
    }
    logger: {
        error: (payload: unknown, message?: string) => void
    }
}

export const createMessageUpdateHandler =
    ({ api, logger }: UpdateMessageDependencies) =>
    async (_oldMessage: Message | null, newMessage: Message) => {
        if (newMessage.system) return

        try {
            await api.updateMessage({
                id: newMessage.id,
                content: newMessage.content || "",
                discordUpdatedAt: newMessage.editedAt,
            })
        } catch (error) {
            logger.error(
                { error: serializeErrorForLogging(error) },
                "Failed to update message"
            )
        }
    }
