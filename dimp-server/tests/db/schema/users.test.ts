import { userInsertSchema } from "@/db/schema/users"
import { type Static } from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value"
import { describe, expect, test } from "bun:test"

type UserInsert = Static<typeof userInsertSchema>

const parseUserInsert = (input: unknown): UserInsert => {
    if (!Value.Check(userInsertSchema, input)) {
        throw new Error("Invalid user insert payload")
    }

    return input as UserInsert
}

describe("userInsertSchema", () => {
    test("accepts a valid insert payload", () => {
        const parsed = parseUserInsert({
            id: "u-1",
            username: "luke",
            discriminator: "1234",
        })

        expect(parsed).toMatchObject({
            id: "u-1",
            username: "luke",
            discriminator: "1234",
        })
    })

    test("rejects missing discriminator", () => {
        expect(() =>
            parseUserInsert({
                id: "u-1",
                username: "luke",
            })
        ).toThrow()
    })
})
