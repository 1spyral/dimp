import { env } from "@/env"
import { makeGenerateChatResponseResolver } from "@/graphql/mutations/GenerateChatResponse"
import { describe, expect, mock, test } from "bun:test"
import { GraphQLError } from "graphql"
import { createMockContextLogger } from "./test-logger"

const createDb = (
    historyRows: Array<{
        content: string | null
        userId: string
    }>,
    userRows: Array<{
        id: string
        username: string
    }>
) => {
    let selectCallCount = 0

    return {
        select: mock(() => {
            selectCallCount += 1

            if (selectCallCount === 1) {
                return {
                    from: mock(() => ({
                        where: mock(() => ({
                            orderBy: mock(() => ({
                                limit: mock(() => Promise.resolve(historyRows)),
                            })),
                        })),
                    })),
                }
            }

            return {
                from: mock(() => ({
                    where: mock(() => Promise.resolve(userRows)),
                })),
            }
        }),
    } as never
}

describe("generateChatResponseResolver", () => {
    test("prefixes known usernames for human chat context", async () => {
        const invokeChatWorkflow = mock(async (_getAgents, state) => ({
            ...state,
            response: "stubbed response",
        }))
        const logger = createMockContextLogger()
        const resolver = makeGenerateChatResponseResolver({
            invokeChatWorkflow,
        })

        const result = await resolver(
            null,
            {
                input: {
                    id: "250",
                    guildId: "g-1",
                    channelId: "c-1",
                    userId: "u-current",
                    content: "current message",
                },
            },
            {
                db: createDb(
                    [
                        {
                            content: "bot reply",
                            userId: env.DISCORD_CLIENT_ID,
                        },
                        {
                            content: "second",
                            userId: "u-older-2",
                        },
                        {
                            content: "first",
                            userId: "u-older-1",
                        },
                    ],
                    [
                        { id: "u-older-1", username: "alice" },
                        { id: "u-current", username: "carol" },
                    ]
                ),
                getAgents: async () => {
                    throw new Error("not used")
                },
                logger,
            }
        )

        expect(result).toBe("stubbed response")
        expect(invokeChatWorkflow).toHaveBeenCalledTimes(1)
        expect(invokeChatWorkflow.mock.calls[0]?.[1]).toEqual({
            history: [
                { content: "alice: first", user: "u-older-1" },
                { content: "u-older-2: second", user: "u-older-2" },
                { content: "bot reply", user: env.DISCORD_CLIENT_ID },
            ],
            message: {
                content: "carol: current message",
                user: "u-current",
            },
        })
        expect(logger.error).not.toHaveBeenCalled()
    })

    test("logs and throws GraphQLError when workflow invocation fails", async () => {
        const workflowError = new Error("workflow boom")
        const invokeChatWorkflow = mock(async () => {
            throw workflowError
        })
        const logger = createMockContextLogger()
        const resolver = makeGenerateChatResponseResolver({
            invokeChatWorkflow,
        })

        await expect(
            resolver(
                null,
                {
                    input: {
                        id: "250",
                        guildId: "g-1",
                        channelId: "c-1",
                        userId: "u-current",
                        content: "current message",
                    },
                },
                {
                    db: createDb([], []),
                    getAgents: async () => {
                        throw new Error("not used")
                    },
                    logger,
                }
            )
        ).rejects.toBeInstanceOf(GraphQLError)

        expect(logger.error).toHaveBeenCalledTimes(1)
    })
})
