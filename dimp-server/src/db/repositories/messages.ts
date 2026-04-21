import { messages } from "@/db/schema"
import type { Context } from "@/graphql/context"
import { eq } from "drizzle-orm"

type DB = Pick<Context, "db">["db"]

export type MessageRow = typeof messages.$inferSelect
export type CreateMessageInput = typeof messages.$inferInsert & {
    guildName: string
}
export type UpdateMessageInput = Pick<
    typeof messages.$inferInsert,
    "id" | "content" | "discordUpdatedAt" | "discordDeletedAt"
>

export const createMessage = async (
    db: DB,
    input: CreateMessageInput
): Promise<MessageRow | undefined> => {
    const { guildName: _guildName, ...messageInput } = input
    const [row] = await db
        .insert(messages)
        .values(messageInput)
        .onConflictDoNothing()
        .returning()

    return row
}

export const updateMessage = async (
    db: DB,
    input: UpdateMessageInput
): Promise<MessageRow | undefined> => {
    return await db
        .update(messages)
        .set(input)
        .where(eq(messages.id, input.id))
        .returning()
        .then(rows => rows[0])
}

export const getMessageById = async (
    db: DB,
    id: string
): Promise<MessageRow | undefined> => {
    return await db.query.messages.findFirst({
        where: (m, { eq }) => eq(m.id, id),
    })
}
