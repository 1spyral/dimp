import { DEFAULT_GUILD_SOUL } from "@/config/guild-soul"
import { getGuildById, upsertGuild } from "@/db/repositories/guilds"
import { guilds } from "@/db/schema"
import { describe, expect, mock, test } from "bun:test"

describe("guildRepository", () => {
    test("upsertGuild inserts and returns the created row", async () => {
        const input = {
            id: "g-1",
            name: "Guild One",
        }
        const row = {
            ...input,
            soul: DEFAULT_GUILD_SOUL,
        }

        const returning = mock(async () => [row])
        const onConflictDoUpdate = mock(() => ({ returning }))
        const values = mock(() => ({ onConflictDoUpdate }))
        const insert = mock(() => ({ values }))
        const db = { insert } as never

        const result = await upsertGuild(db, input)

        expect(result).toMatchObject(row)
        expect(insert).toHaveBeenCalledWith(guilds)
        expect(values).toHaveBeenCalledWith(input)
        expect(onConflictDoUpdate).toHaveBeenCalledWith({
            target: guilds.id,
            set: {
                name: "Guild One",
            },
        })
        expect(returning).toHaveBeenCalledTimes(1)
    })

    test("getGuildById returns the found row", async () => {
        const findFirst = mock(async () => ({
            id: "g-1",
            name: "Guild One",
            soul: DEFAULT_GUILD_SOUL,
        }))
        const db = {
            query: {
                guilds: { findFirst },
            },
        } as never

        const result = await getGuildById(db, "g-1")

        expect(result).toMatchObject({
            id: "g-1",
            name: "Guild One",
            soul: DEFAULT_GUILD_SOUL,
        })
        expect(findFirst).toHaveBeenCalledTimes(1)
    })

    test("getGuildById returns undefined when guild does not exist", async () => {
        const findFirst = mock(async () => undefined)
        const db = {
            query: {
                guilds: { findFirst },
            },
        } as never

        const result = await getGuildById(db, "missing")

        expect(result).toBeUndefined()
        expect(findFirst).toHaveBeenCalledTimes(1)
    })
})
