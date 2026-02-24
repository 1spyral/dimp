import { userRepository } from "@/db/repositories"
import { builder, UserRef } from "@graphql"
import { GraphQLError } from "graphql"
import type { Context } from "../context"

interface GetUserResolverDeps {
    getUserById: typeof userRepository.getUserById
}

export const makeGetUserResolver =
    (deps: GetUserResolverDeps) =>
    async (
        _parent: unknown,
        args: { id: string },
        ctx: Pick<Context, "db" | "logger">
    ) => {
        try {
            return await deps.getUserById(ctx.db, args.id)
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
                "getUser failed"
            )

            throw new GraphQLError("Failed to fetch user")
        }
    }

export const getUserResolver = makeGetUserResolver(userRepository)

builder.queryField("user", t =>
    t.field({
        type: UserRef,
        nullable: true,
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: getUserResolver,
    })
)
