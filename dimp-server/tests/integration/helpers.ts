import { DEFAULT_GUILD_SOUL } from "@/config/guild-soul"
import { guilds, messages, users } from "@/db/schema"
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

export const request = (path: string, init?: RequestInit) =>
    server.handle(new Request(`http://localhost${path}`, init))

export const graphqlRequest = async <TData>(
    query: string,
    variables?: Record<string, unknown>
) => {
    const response = await request("/graphql", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
    })

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

interface SeedUserOverrides {
    id?: string
    username?: string
    discriminator?: string
}

export const seedUser = async (overrides: SeedUserOverrides = {}) => {
    const row = {
        id: overrides.id ?? `iu-${randomUUID()}`,
        username: overrides.username ?? "seed-user",
        discriminator: overrides.discriminator ?? "0001",
    }

    await db.insert(users).values(row)

    return row
}

interface SeedGuildOverrides {
    id?: string
    name?: string
    soul?: string
}

export const seedGuild = async (overrides: SeedGuildOverrides = {}) => {
    const row = {
        id: overrides.id ?? `ig-${randomUUID()}`,
        name: overrides.name ?? "seed-guild",
        soul: overrides.soul ?? DEFAULT_GUILD_SOUL,
    }

    await db.insert(guilds).values(row)

    return row
}
