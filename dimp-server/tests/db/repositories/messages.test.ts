import {
    createMessage,
    getMessageById,
    updateMessage,
} from "@/db/repositories/messages"
import { messages } from "@/db/schema"
import { describe, expect, mock, test } from "bun:test"

describe("messageRepository", () => {
    test("createMessage inserts and returns the created row", async () => {
        const now = new Date("2025-01-01T00:00:00.000Z")
        const input = {
            id: "m-1",
            guildId: "g-1",
            guildName: "Guild One",
            channelId: "c-1",
            userId: "u-1",
            content: "hello",
            discordCreatedAt: now,
            discordUpdatedAt: now,
        }

        const returning = mock(async () => [{ ...input }])
        const onConflictDoNothing = mock(() => ({ returning }))
        const values = mock(() => ({ onConflictDoNothing }))
        const insert = mock(() => ({ values }))
        const db = { insert } as never

        const result = await createMessage(db, input)

        expect(result).toMatchObject({ id: "m-1", content: "hello" })
        expect(insert).toHaveBeenCalledWith(messages)
        expect(values).toHaveBeenCalledWith({
            id: "m-1",
            guildId: "g-1",
            channelId: "c-1",
            userId: "u-1",
            content: "hello",
            discordCreatedAt: now,
            discordUpdatedAt: now,
        })
        expect(onConflictDoNothing).toHaveBeenCalledTimes(1)
        expect(returning).toHaveBeenCalledTimes(1)
    })

    test("createMessage returns undefined when conflict does nothing", async () => {
        const now = new Date("2025-01-01T00:00:00.000Z")
        const returning = mock(async () => [])
        const onConflictDoNothing = mock(() => ({ returning }))
        const values = mock(() => ({ onConflictDoNothing }))
        const insert = mock(() => ({ values }))
        const db = { insert } as never

        const result = await createMessage(db, {
            id: "m-1",
            guildId: "g-1",
            guildName: "Guild One",
            channelId: "c-1",
            userId: "u-1",
            content: "hello",
            discordCreatedAt: now,
            discordUpdatedAt: now,
        })

        expect(result).toBeUndefined()
    })

    test("updateMessage updates matching row and returns first result", async () => {
        const input = {
            id: "m-1",
            content: "updated",
            discordUpdatedAt: new Date("2025-01-01T00:00:00.000Z"),
            discordDeletedAt: null,
        }

        const returning = mock(() =>
            Promise.resolve([{ id: "m-1", content: "updated" }])
        )
        const where = mock(() => ({ returning }))
        const set = mock(() => ({ where }))
        const update = mock(() => ({ set }))
        const db = { update } as never

        const result = await updateMessage(db, input)

        expect(result).toMatchObject({ id: "m-1", content: "updated" })
        expect(update).toHaveBeenCalledWith(messages)
        expect(set).toHaveBeenCalledWith(input)
        expect(where).toHaveBeenCalledTimes(1)
        expect(returning).toHaveBeenCalledTimes(1)
    })

    test("updateMessage returns undefined when no rows match", async () => {
        const returning = mock(() => Promise.resolve([]))
        const where = mock(() => ({ returning }))
        const set = mock(() => ({ where }))
        const update = mock(() => ({ set }))
        const db = { update } as never

        const result = await updateMessage(db, {
            id: "missing",
            content: "updated",
            discordUpdatedAt: new Date("2025-01-01T00:00:00.000Z"),
        })

        expect(result).toBeUndefined()
    })

    test("getMessageById returns the found row", async () => {
        const findFirst = mock(async () => ({ id: "m-1", content: "hello" }))
        const db = {
            query: {
                messages: { findFirst },
            },
        } as never

        const result = await getMessageById(db, "m-1")

        expect(result).toMatchObject({ id: "m-1", content: "hello" })
        expect(findFirst).toHaveBeenCalledTimes(1)
    })

    test("getMessageById returns undefined when message does not exist", async () => {
        const findFirst = mock(async () => undefined)
        const db = {
            query: {
                messages: { findFirst },
            },
        } as never

        const result = await getMessageById(db, "missing")

        expect(result).toBeUndefined()
        expect(findFirst).toHaveBeenCalledTimes(1)
    })
})
