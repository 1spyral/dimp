import { guildRepository, messageRepository } from "@/db/repositories"
import { serializeErrorForLogging } from "@/logger"
import { builder, MessageRef } from "@graphql"
import { GraphQLError } from "graphql"

const CreateMessageInput = builder.inputType("CreateMessageInput", {
    fields: t => ({
        id: t.id({ required: true }),
        guildId: t.id({ required: true }),
        guildName: t.string({ required: true }),
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
    upsertGuild: typeof guildRepository.upsertGuild
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
            await deps.upsertGuild(ctx.db, {
                id: args.input.guildId,
                name: args.input.guildName,
            })

            return await deps.createMessage(ctx.db, args.input)
        } catch (e: unknown) {
            ctx.logger.error(
                {
                    error: serializeErrorForLogging(e),
                    input: args.input,
                },
                "createMessage failed"
            )

            throw new GraphQLError("Failed to create message")
        }
    }

export const createMessageResolver = makeCreateMessageResolver({
    upsertGuild: guildRepository.upsertGuild,
    createMessage: messageRepository.createMessage,
})

builder.mutationField("createMessage", t =>
    t.field({
        type: MessageRef,
        nullable: false,
        args: { input: t.arg({ type: CreateMessageInput, required: true }) },
        resolve: createMessageResolver,
    })
)
