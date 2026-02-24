import { type ChatStateType } from "@/ai/workflows/chat"
import { messages } from "@/db/schema"
import type { Context } from "@/graphql/context"
import { builder } from "@graphql"
import { and, desc, eq, lt } from "drizzle-orm"
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
        agents: Pick<Context, "agents">["agents"],
        state: ChatStateType
    ) => Promise<ChatStateType>
}

export const makeGenerateChatResponseResolver =
    (deps: GenerateChatResponseResolverDeps) =>
    async (
        _parent: unknown,
        args: GenerateChatResponseResolverArgs,
        ctx: Pick<Context, "db" | "agents" | "logger">
    ): Promise<string> => {
        try {
            const history = await ctx.db
                .select()
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

            const initialState: ChatStateType = {
                history: history.map(msg => ({
                    content: msg.content,
                    user: msg.userId,
                })),
                message: {
                    content: args.input.content,
                    user: args.input.userId,
                },
            }

            const result = await deps.invokeChatWorkflow(
                ctx.agents,
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
    invokeChatWorkflow: (agents, state) => agents.chatWorkflow.invoke(state),
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
