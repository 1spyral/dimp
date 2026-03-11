import { type ChatStateType } from "@/ai/workflows/chat"
import { messages, users } from "@/db/schema"
import { env } from "@/env"
import type { Context } from "@/graphql/context"
import { builder } from "@graphql"
import { and, desc, eq, inArray, lt } from "drizzle-orm"
import { GraphQLError } from "graphql"

const GenerateChatResponseInput = builder.inputType(
    "GenerateChatResponseInput",
    {
        fields: t => ({
            id: t.id({ required: true }),
            guildId: t.id({ required: true }),
            channelId: t.id({ required: true }),
            userId: t.id({ required: true }),
            content: t.string({ required: true }),
        }),
    }
)

interface GenerateChatResponseResolverArgs {
    input: {
        id: string
        guildId: string
        channelId: string
        userId: string
        content: string
    }
}

interface GenerateChatResponseResolverDeps {
    invokeChatWorkflow: (
        getAgents: Pick<Context, "getAgents">["getAgents"],
        state: ChatStateType
    ) => Promise<ChatStateType>
}

const formatChatMessageContent = ({
    content,
    userId,
    username,
    includeUsername = true,
}: {
    content: string | null
    userId: string
    username?: string | null
    includeUsername?: boolean
}) => {
    if (!includeUsername) {
        return content ?? ""
    }

    const displayName = username ?? userId
    return `${displayName}: ${content ?? ""}`
}

export const makeGenerateChatResponseResolver =
    (deps: GenerateChatResponseResolverDeps) =>
    async (
        _parent: unknown,
        args: GenerateChatResponseResolverArgs,
        ctx: Pick<Context, "db" | "getAgents" | "logger">
    ): Promise<string> => {
        try {
            const history = await ctx.db
                .select({
                    content: messages.content,
                    userId: messages.userId,
                })
                .from(messages)
                .where(
                    and(
                        eq(messages.channelId, args.input.channelId),
                        eq(messages.guildId, args.input.guildId),
                        lt(messages.id, args.input.id)
                    )
                )
                .orderBy(desc(messages.id))
                .limit(100)
                .then(rows => rows.reverse())

            const participantIds = [
                ...new Set([
                    args.input.userId,
                    ...history.map(message => message.userId),
                ]),
            ]
            const knownUsers = await ctx.db
                .select({
                    id: users.id,
                    username: users.username,
                })
                .from(users)
                .where(inArray(users.id, participantIds))
            const usernamesById = new Map(
                knownUsers.map(user => [user.id, user.username])
            )

            const initialState: ChatStateType = {
                history: history.map(msg => ({
                    content: formatChatMessageContent({
                        ...msg,
                        username: usernamesById.get(msg.userId),
                        includeUsername: msg.userId !== env.DISCORD_CLIENT_ID,
                    }),
                    user: msg.userId,
                })),
                message: {
                    content: formatChatMessageContent({
                        content: args.input.content,
                        userId: args.input.userId,
                        username: usernamesById.get(args.input.userId),
                        includeUsername:
                            args.input.userId !== env.DISCORD_CLIENT_ID,
                    }),
                    user: args.input.userId,
                },
            }

            const result = await deps.invokeChatWorkflow(
                ctx.getAgents,
                initialState
            )

            return result.response ?? "No response generated."
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
                "generateChatResponse failed"
            )

            throw new GraphQLError("Failed to generate chat response")
        }
    }

export const generateChatResponseResolver = makeGenerateChatResponseResolver({
    invokeChatWorkflow: async (getAgents, state) => {
        const agents = await getAgents()
        return agents.chatWorkflow.invoke(state)
    },
})

builder.mutationField("generateChatResponse", t =>
    t.field({
        type: "String",
        nullable: false,
        args: {
            input: t.arg({ type: GenerateChatResponseInput, required: true }),
        },
        resolve: generateChatResponseResolver,
    })
)
