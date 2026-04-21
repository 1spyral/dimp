import { guilds } from "@/db/schema"
import type { Context } from "@/graphql/context"

type DB = Pick<Context, "db">["db"]

export type GuildRow = typeof guilds.$inferSelect
export type UpsertGuildInput = Pick<typeof guilds.$inferInsert, "id" | "name">

export const getGuildById = async (
    db: DB,
    id: string
): Promise<GuildRow | undefined> => {
    return await db.query.guilds.findFirst({
        where: (g, { eq }) => eq(g.id, id),
    })
}

export const upsertGuild = async (
    db: DB,
    input: UpsertGuildInput
): Promise<GuildRow> => {
    const [row] = await db
        .insert(guilds)
        .values(input)
        .onConflictDoUpdate({
            target: guilds.id,
            set: {
                name: input.name,
            },
        })
        .returning()

    return row
}
