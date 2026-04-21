import { type ChatStateType } from "@/ai/workflows/chat"
import { DEFAULT_GUILD_SOUL } from "@/config/guild-soul"
import { messages, users } from "@/db/schema"
import type { Context } from "@/graphql/context"
import { serializeErrorForLogging } from "@/logger"
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
            const guild = await ctx.db.query.guilds.findFirst({
                columns: {
                    soul: true,
                },
                where: (guild, { eq }) => eq(guild.id, args.input.guildId),
            })
            const usernamesById = new Map(
                knownUsers.map(user => [user.id, user.username])
            )

            const initialState: ChatStateType = {
                soul: guild?.soul ?? DEFAULT_GUILD_SOUL,
                history: history.map(msg => ({
                    content: msg.content,
                    user: msg.userId,
                    username: usernamesById.get(msg.userId),
                })),
                message: {
                    content: args.input.content,
                    user: args.input.userId,
                    username: usernamesById.get(args.input.userId),
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
                    error: serializeErrorForLogging(e),
                    input: args.input,
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
