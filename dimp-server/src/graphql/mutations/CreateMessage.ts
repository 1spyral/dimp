import { messageRepository } from "@/db/repositories"
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

interface CreateMessageResolverArgs {
    input: messageRepository.CreateMessageInput
}

interface CreateMessageResolverDeps {
    createMessage: typeof messageRepository.createMessage
}

export const makeCreateMessageResolver =
    (deps: CreateMessageResolverDeps) =>
    async (
        _parent: unknown,
        args: CreateMessageResolverArgs,
        ctx: Pick<Context, "db" | "logger">
    ) => {
        try {
            return await deps.createMessage(ctx.db, args.input)
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
    }

export const createMessageResolver =
    makeCreateMessageResolver(messageRepository)

builder.mutationField("createMessage", t =>
    t.field({
        type: MessageRef,
        nullable: false,
        args: { input: t.arg({ type: CreateMessageInput, required: true }) },
        resolve: createMessageResolver,
    })
)
