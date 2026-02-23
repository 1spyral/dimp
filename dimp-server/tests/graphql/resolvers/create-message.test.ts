import { makeCreateMessageResolver } from "@/graphql/mutations/CreateMessage"
import { describe, expect, mock, test } from "bun:test"
import { GraphQLError } from "graphql"

const input = {
    id: "m-1",
    guildId: "g-1",
    channelId: "c-1",
    userId: "u-1",
    content: "hello",
    discordCreatedAt: new Date("2025-01-01T00:00:00.000Z"),
    discordUpdatedAt: new Date("2025-01-01T00:00:00.000Z"),
}

describe("createMessageResolver", () => {
    test("returns inserted row", async () => {
        const createMessage = mock(async () => ({ ...input }))
        const logger = { error: mock(() => {}) }
        const resolver = makeCreateMessageResolver({ createMessage })

        const db = {} as never

        const result = await resolver(null, { input }, { db, logger })

        expect(result).toMatchObject({ id: "m-1", content: "hello" })
        expect(createMessage).toHaveBeenCalledTimes(1)
        expect(createMessage).toHaveBeenCalledWith(db, input)
        expect(logger.error).not.toHaveBeenCalled()
    })

    test("logs and throws GraphQLError when db insert fails", async () => {
        const dbError = new Error("db down")
        const createMessage = mock(async () => {
            throw dbError
        })
        const logger = { error: mock(() => {}) }
        const resolver = makeCreateMessageResolver({ createMessage })
        const db = {} as never

        await expect(
            resolver(null, { input }, { db, logger })
        ).rejects.toBeInstanceOf(GraphQLError)

        expect(createMessage).toHaveBeenCalledWith(db, input)
        expect(logger.error).toHaveBeenCalledTimes(1)
    })
})
