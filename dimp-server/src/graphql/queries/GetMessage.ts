import { messageRepository } from "@/db/repositories"
import { serializeErrorForLogging } from "@/logger"
import { builder, MessageRef } from "@graphql"
import { GraphQLError } from "graphql"
import type { Context } from "../context"

interface GetMessageResolverDeps {
    getMessageById: typeof messageRepository.getMessageById
}

export const makeGetMessageResolver =
    (deps: GetMessageResolverDeps) =>
    async (
        _parent: unknown,
        args: { id: string },
        ctx: Pick<Context, "db" | "logger">
    ) => {
        try {
            return await deps.getMessageById(ctx.db, args.id)
        } catch (e: unknown) {
            ctx.logger.error(
                {
                    error: serializeErrorForLogging(e),
                    id: args.id,
                },
                "getMessage failed"
            )

            throw new GraphQLError("Failed to fetch message")
        }
    }

export const getMessageResolver = makeGetMessageResolver(messageRepository)

builder.queryField("message", t =>
    t.field({
        type: MessageRef,
        nullable: true,
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: getMessageResolver,
    })
)
