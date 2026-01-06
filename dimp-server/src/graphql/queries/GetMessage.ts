import { builder, MessageRef } from "@graphql"
import { GraphQLError } from "graphql"

builder.queryField("message", t =>
    t.field({
        type: MessageRef,
        nullable: true,
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: async (_parent, args, ctx) => {
            try {
                return await ctx.db.query.messages.findFirst({
                    where: (m, { eq }) => eq(m.id, args.id),
                })
            } catch (e: unknown) {
                ctx.logger.error(
                    {
                        err: e,
                        id: args.id,
                        message:
                            e instanceof Error
                                ? e.message
                                : typeof e === "string"
                                  ? e
                                  : undefined,
                        stack: e instanceof Error ? e.stack : undefined,
                    },
                    "getMessage failed"
                )

                throw new GraphQLError("Failed to fetch message")
            }
        },
    })
)
