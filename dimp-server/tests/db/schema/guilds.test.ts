import { guildInsertSchema } from "@/db/schema/guilds"
import { type Static } from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value"
import { describe, expect, test } from "bun:test"

type GuildInsert = Static<typeof guildInsertSchema>

const parseGuildInsert = (input: unknown): GuildInsert => {
    if (!Value.Check(guildInsertSchema, input)) {
        throw new Error("Invalid guild insert payload")
    }

    return input as GuildInsert
}

describe("guildInsertSchema", () => {
    test("accepts a valid insert payload", () => {
        const parsed = parseGuildInsert({
            id: "g-1",
            name: "Guild One",
        })

        expect(parsed).toMatchObject({
            id: "g-1",
            name: "Guild One",
        })
    })

    test("rejects missing name", () => {
        expect(() =>
            parseGuildInsert({
                id: "g-1",
            })
        ).toThrow()
    })
})
