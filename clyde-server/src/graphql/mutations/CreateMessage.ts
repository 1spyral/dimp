import { messages } from "@/db/schema"
import { builder, MessageRef } from "@graphql"

const CreateMessageInput = builder.inputType("CreateMessageInput", {
    fields: t => ({
        id: t.id({ required: true }),
        guildId: t.id({ required: true }),
        channelId: t.id({ required: true }),
        userId: t.id({ required: true }),
        content: t.string({ required: true }),
        discordCreatedAt: t.field({ type: "DateTime", required: true }),
        discordUpdatedAt: t.field({ type: "DateTime", required: true }),
        discordDeletedAt: t.field({ type: "DateTime" }),
    }),
})

builder.mutationField("createMessage", t =>
    t.field({
        type: MessageRef,
        nullable: false,
        args: { input: t.arg({ type: CreateMessageInput, required: true }) },
        resolve: async (_parent, args, ctx) => {
            return await ctx.db
                .insert(messages)
                .values(args.input)
                .returning()
                .then(r => r[0])
        },
    })
)
