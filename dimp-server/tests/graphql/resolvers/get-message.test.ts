import { makeGetMessageResolver } from "@/graphql/queries/GetMessage"
import { describe, expect, mock, test } from "bun:test"
import { GraphQLError } from "graphql"
import { createMockContextLogger } from "./test-logger"

describe("getMessageResolver", () => {
    test("returns found message", async () => {
        const getMessageById = mock(async () => ({
            id: "m-1",
            content: "hello",
        }))
        const logger = createMockContextLogger()
        const resolver = makeGetMessageResolver({ getMessageById })
        const db = {} as never

        const result = await resolver(null, { id: "m-1" }, { db, logger })

        expect(result).toMatchObject({ id: "m-1", content: "hello" })
        expect(getMessageById).toHaveBeenCalledTimes(1)
        expect(getMessageById).toHaveBeenCalledWith(db, "m-1")
        expect(logger.error).not.toHaveBeenCalled()
    })

    test("logs and throws GraphQLError when query fails", async () => {
        const getMessageById = mock(async () => {
            throw new Error("read failed")
        })
        const logger = createMockContextLogger()
        const resolver = makeGetMessageResolver({ getMessageById })
        const db = {} as never

        await expect(
            resolver(null, { id: "m-1" }, { db, logger })
        ).rejects.toBeInstanceOf(GraphQLError)

        expect(getMessageById).toHaveBeenCalledWith(db, "m-1")
        expect(logger.error).toHaveBeenCalledTimes(1)
    })
})
