import { makeUpsertUserResolver } from "@/graphql/mutations/UpsertUser"
import { describe, expect, mock, test } from "bun:test"
import { GraphQLError } from "graphql"
import { createMockContextLogger } from "./test-logger"

const input = {
    id: "u-1",
    username: "luke",
    discriminator: "0001",
}

describe("upsertUserResolver", () => {
    test("returns upserted row", async () => {
        const upsertUser = mock(async () => ({ ...input }))
        const logger = createMockContextLogger()
        const resolver = makeUpsertUserResolver({ upsertUser })
        const db = {} as never

        const result = await resolver(null, { input }, { db, logger })

        expect(result).toMatchObject(input)
        expect(upsertUser).toHaveBeenCalledTimes(1)
        expect(upsertUser).toHaveBeenCalledWith(db, input)
        expect(logger.error).not.toHaveBeenCalled()
    })

    test("logs and throws GraphQLError when db upsert fails", async () => {
        const dbError = new Error("db down")
        const upsertUser = mock(async () => {
            throw dbError
        })
        const logger = createMockContextLogger()
        const resolver = makeUpsertUserResolver({ upsertUser })
        const db = {} as never

        await expect(
            resolver(null, { input }, { db, logger })
        ).rejects.toBeInstanceOf(GraphQLError)

        expect(upsertUser).toHaveBeenCalledWith(db, input)
        expect(logger.error).toHaveBeenCalledTimes(1)
    })
})
