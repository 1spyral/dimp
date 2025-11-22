import { builder, MessageRef } from "@graphql"

builder.queryField("message", t =>
    t.field({
        type: MessageRef,
        nullable: true,
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: async (_parent, args, ctx) => {
            return await ctx.db.query.messages.findFirst({
                where: (m, { eq }) => eq(m.id, args.id),
            })
        },
    })
)
