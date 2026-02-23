import { messageRepository } from "@/db/repositories"
import { builder } from "../builder"
import type { Context } from "../context"
import { MessageRef } from "../types"

const UpdateMessageInput = builder.inputType("UpdateMessageInput", {
    fields: t => ({
        id: t.id({ required: true }),
        content: t.string({ required: true }),
        discordUpdatedAt: t.field({ type: "DateTime", required: true }),
        discordDeletedAt: t.field({ type: "DateTime" }),
    }),
})

interface UpdateMessageResolverArgs {
    input: messageRepository.UpdateMessageInput
}

interface UpdateMessageResolverDeps {
    updateMessage: typeof messageRepository.updateMessage
}

export const makeUpdateMessageResolver =
    (deps: UpdateMessageResolverDeps) =>
    async (
        _parent: unknown,
        args: UpdateMessageResolverArgs,
        ctx: Pick<Context, "db">
    ) => {
        return await deps.updateMessage(ctx.db, args.input)
    }

export const updateMessageResolver =
    makeUpdateMessageResolver(messageRepository)

builder.mutationField("updateMessage", t =>
    t.field({
        type: MessageRef,
        args: {
            input: t.arg({ type: UpdateMessageInput, required: true }),
        },
        resolve: updateMessageResolver,
    })
)
