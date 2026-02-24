import { users } from "@/db/schema"
import type { Context } from "@/graphql/context"

type DB = Pick<Context, "db">["db"]

export type UserRow = typeof users.$inferSelect
export type UpsertUserInput = Pick<
    typeof users.$inferInsert,
    "id" | "username" | "discriminator"
>

export const getUserById = async (
    db: DB,
    id: string
): Promise<UserRow | undefined> => {
    return await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, id),
    })
}

export const upsertUser = async (
    db: DB,
    input: UpsertUserInput
): Promise<UserRow> => {
    const [row] = await db
        .insert(users)
        .values(input)
        .onConflictDoUpdate({
            target: users.id,
            set: {
                username: input.username,
                discriminator: input.discriminator,
            },
        })
        .returning()

    return row
}
