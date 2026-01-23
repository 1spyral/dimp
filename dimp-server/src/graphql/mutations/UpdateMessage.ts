import { eq } from "drizzle-orm"
import { messages } from "@/db/schema"
import { builder } from "../builder"
import { MessageRef } from "../types"

const UpdateMessageInput = builder.inputType("UpdateMessageInput", {
    fields: t => ({
        id: t.id({ required: true }),
        content: t.string({ required: true }),
        discordUpdatedAt: t.field({ type: "DateTime", required: true }),
        discordDeletedAt: t.field({ type: "DateTime" }),
    }),
})

builder.mutationField("updateMessage", t =>
    t.field({
        type: MessageRef,
        args: {
            input: t.arg({ type: UpdateMessageInput, required: true }),
        },
        resolve: async (_parent, args, ctx) => {
            return await ctx.db
                .update(messages)
                .set(args.input)
                .where(eq(messages.id, args.input.id))
                .returning()
                .then(r => r[0])
        },
    })
)
