import { userRepository } from "@/db/repositories"
import { serializeErrorForLogging } from "@/logger"
import { GraphQLError } from "graphql"
import { builder } from "../builder"
import type { Context } from "../context"
import { UserRef } from "../types"

const UpsertUserInput = builder.inputType("UpsertUserInput", {
    fields: t => ({
        id: t.id({ required: true }),
        username: t.string({ required: true }),
        discriminator: t.string({ required: true }),
    }),
})

interface UpsertUserResolverArgs {
    input: userRepository.UpsertUserInput
}

interface UpsertUserResolverDeps {
    upsertUser: typeof userRepository.upsertUser
}

export const makeUpsertUserResolver =
    (deps: UpsertUserResolverDeps) =>
    async (
        _parent: unknown,
        args: UpsertUserResolverArgs,
        ctx: Pick<Context, "db" | "logger">
    ) => {
        try {
            return await deps.upsertUser(ctx.db, args.input)
        } catch (e: unknown) {
            ctx.logger.error(
                {
                    error: serializeErrorForLogging(e),
                    input: args.input,
                },
                "upsertUser failed"
            )

            throw new GraphQLError("Failed to upsert user")
        }
    }

export const upsertUserResolver = makeUpsertUserResolver(userRepository)

builder.mutationField("upsertUser", t =>
    t.field({
        type: UserRef,
        nullable: false,
        args: {
            input: t.arg({ type: UpsertUserInput, required: true }),
        },
        resolve: upsertUserResolver,
    })
)
