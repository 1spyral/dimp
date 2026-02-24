import { messages } from "@/db/schema"
import { db } from "@/drizzle"
import { server } from "@/server"
import { expect } from "bun:test"
import { randomUUID } from "node:crypto"

interface GraphQLErrorShape {
    message: string
}

export interface GraphQLResponse<TData> {
    data?: TData
    errors?: GraphQLErrorShape[]
}

export const graphqlRequest = async <TData>(
    query: string,
    variables?: Record<string, unknown>
) => {
    const response = await server.handle(
        new Request("http://localhost/graphql", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ query, variables }),
        })
    )

    expect(response.status).toBe(200)

    return (await response.json()) as GraphQLResponse<TData>
}

interface SeedMessageOverrides {
    id?: string
    guildId?: string
    channelId?: string
    userId?: string
    content?: string | null
    discordCreatedAt?: Date
    discordUpdatedAt?: Date
    discordDeletedAt?: Date | null
}

export const seedMessage = async (overrides: SeedMessageOverrides = {}) => {
    const discordCreatedAt =
        overrides.discordCreatedAt ?? new Date("2025-01-01T00:00:00.000Z")
    const discordUpdatedAt =
        overrides.discordUpdatedAt ?? new Date("2025-01-01T00:00:00.000Z")

    const row = {
        id: overrides.id ?? `it-${randomUUID()}`,
        guildId: overrides.guildId ?? "g-1",
        channelId: overrides.channelId ?? "c-1",
        userId: overrides.userId ?? "u-1",
        content:
            "content" in overrides
                ? (overrides.content ?? null)
                : "seed message",
        discordCreatedAt,
        discordUpdatedAt,
        discordDeletedAt: overrides.discordDeletedAt ?? null,
    }

    await db.insert(messages).values(row)

    return row
}
