import { userInsertSchema } from "@/db/schema/users"
import { describe, expect, test } from "bun:test"

describe("userInsertSchema", () => {
    test("accepts a valid insert payload", () => {
        const parsed = userInsertSchema.parse({
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
            userInsertSchema.parse({
                id: "u-1",
                username: "luke",
            })
        ).toThrow()
    })
})
