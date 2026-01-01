import { eq } from "drizzle-orm"
import { messages } from "@/db/schema"
import { builder } from "../builder"
import { MessageRef } from "../types"

builder.mutationField("updateMessage", t =>
    t.field({
        type: MessageRef,
        args: {
            id: t.arg.id({ required: true }),
            content: t.arg.string({ required: true }),
            discordUpdatedAt: t.arg({ type: "DateTime", required: true }),
            discordDeletedAt: t.arg({ type: "DateTime" }),
        },
        resolve: async (_parent, args, ctx) => {
            return await ctx.db
                .update(messages)
                .set(args)
                .where(eq(messages.id, args.id))
                .returning()
                .then(r => r[0])
        },
    })
)
