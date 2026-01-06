import { messages } from "@/db/schema"
import { and, desc, eq, lt } from "drizzle-orm"
import { builder } from "@graphql"
import { GraphQLError } from "graphql"
import { type ChatStateType } from "@/ai/agents/chat"

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

builder.mutationField("generateChatResponse", t =>
    t.field({
        type: "String",
        nullable: false,
        args: {
            input: t.arg({ type: GenerateChatResponseInput, required: true }),
        },
        resolve: async (_parent, args, ctx): Promise<string> => {
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

                const result = await ctx.agents.chatAgent.invoke(initialState)

                return result.response ?? "No response generated."
            } catch (e: unknown) {
                ctx.logger.error(
                    {
                        error: e,
                        input: args.input,
                    },
                    "generateChatResponse failed"
                )

                throw new GraphQLError("Failed to generate chat response")
            }
        },
    })
)
