import type { Message } from "@/types"
import { builder } from "../builder"

export const MessageRef = builder.objectRef<Message>("Message")

MessageRef.implement({
    fields: t => ({
        id: t.exposeID("id"),
        guildId: t.exposeString("guildId"),
        channelId: t.exposeString("channelId"),
        userId: t.exposeString("userId"),
        content: t.exposeString("content"),
        createdAt: t.expose("createdAt", { type: "Date" }),
        updatedAt: t.expose("updatedAt", { type: "Date" }),
    }),
})
