import type { Message } from "@/types"
import { builder } from "../builder"

export const MessageRef = builder.objectRef<Message>("Message")

MessageRef.implement({
    fields: t => ({
        id: t.exposeID("id", { nullable: false }),
        guildId: t.exposeID("guildId", { nullable: false }),
        channelId: t.exposeID("channelId", { nullable: false }),
        userId: t.exposeID("userId", { nullable: false }),
        content: t.exposeString("content", { nullable: true }),
        createdAt: t.expose("createdAt", { type: "DateTime", nullable: false }),
        updatedAt: t.expose("updatedAt", { type: "DateTime", nullable: false }),
        deletedAt: t.expose("deletedAt", { type: "DateTime", nullable: true }),
        discordCreatedAt: t.expose("discordCreatedAt", {
            type: "DateTime",
            nullable: false,
        }),
        discordUpdatedAt: t.expose("discordUpdatedAt", {
            type: "DateTime",
            nullable: false,
        }),
        discordDeletedAt: t.expose("discordDeletedAt", {
            type: "DateTime",
            nullable: true,
        }),
    }),
})
