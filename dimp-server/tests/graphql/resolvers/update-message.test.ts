import { makeUpdateMessageResolver } from "@/graphql/mutations/UpdateMessage"
import { describe, expect, mock, test } from "bun:test"

describe("updateMessageResolver", () => {
    test("updates and returns first row", async () => {
        const input = {
            id: "m-1",
            content: "updated",
            discordUpdatedAt: new Date("2025-01-01T00:00:00.000Z"),
            discordDeletedAt: null,
        }

        const updateMessage = mock(() =>
            Promise.resolve({ id: "m-1", content: "updated" })
        )
        const resolver = makeUpdateMessageResolver({ updateMessage })
        const db = {} as never

        const result = await resolver(null, { input }, { db })

        expect(result).toMatchObject({ id: "m-1", content: "updated" })
        expect(updateMessage).toHaveBeenCalledTimes(1)
        expect(updateMessage).toHaveBeenCalledWith(db, input)
    })

    test("returns undefined when no rows are returned", async () => {
        const updateMessage = mock(() => Promise.resolve(undefined))
        const resolver = makeUpdateMessageResolver({ updateMessage })
        const db = {} as never

        const result = await resolver(
            null,
            {
                input: {
                    id: "missing",
                    content: "updated",
                    discordUpdatedAt: new Date("2025-01-01T00:00:00.000Z"),
                },
            },
            { db }
        )

        expect(result).toBeUndefined()
        expect(updateMessage).toHaveBeenCalledTimes(1)
    })
})
