import { makeGetUserResolver } from "@/graphql/queries/GetUser"
import { describe, expect, mock, test } from "bun:test"
import { GraphQLError } from "graphql"
import { createMockContextLogger } from "./test-logger"

describe("getUserResolver", () => {
    test("returns found user", async () => {
        const getUserById = mock(async () => ({
            id: "u-1",
            username: "luke",
            discriminator: "0001",
        }))
        const logger = createMockContextLogger()
        const resolver = makeGetUserResolver({ getUserById })
        const db = {} as never

        const result = await resolver(null, { id: "u-1" }, { db, logger })

        expect(result).toMatchObject({ id: "u-1", username: "luke" })
        expect(getUserById).toHaveBeenCalledTimes(1)
        expect(getUserById).toHaveBeenCalledWith(db, "u-1")
        expect(logger.error).not.toHaveBeenCalled()
    })

    test("logs and throws GraphQLError when query fails", async () => {
        const getUserById = mock(async () => {
            throw new Error("read failed")
        })
        const logger = createMockContextLogger()
        const resolver = makeGetUserResolver({ getUserById })
        const db = {} as never

        await expect(
            resolver(null, { id: "u-1" }, { db, logger })
        ).rejects.toBeInstanceOf(GraphQLError)

        expect(getUserById).toHaveBeenCalledWith(db, "u-1")
        expect(logger.error).toHaveBeenCalledTimes(1)
    })
})
