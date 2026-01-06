import { messages } from "@/db/schema"
import { builder, MessageRef } from "@graphql"
import { GraphQLError } from "graphql"

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
            try {
                const [row] = await ctx.db
                    .insert(messages)
                    .values(args.input)
                    .onConflictDoNothing()
                    .returning()
                return row
            } catch (e: unknown) {
                ctx.logger.error(
                    {
                        err: e,
                        input: args.input,
                        message:
                            e instanceof Error
                                ? e.message
                                : typeof e === "string"
                                  ? e
                                  : undefined,
                        stack: e instanceof Error ? e.stack : undefined,
                    },
                    "createMessage failed"
                )

                throw new GraphQLError("Failed to create message")
            }
        },
    })
)
