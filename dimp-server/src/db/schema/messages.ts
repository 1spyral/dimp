import { discordTimestamps, timestamps } from "@/db/columns.helpers"
import * as t from "drizzle-orm/pg-core"
import { pgTable } from "drizzle-orm/pg-core"
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod"

export const messages = pgTable("messages", {
    id: t.text().primaryKey(),
    guildId: t.text().notNull(),
    channelId: t.text().notNull(),
    userId: t.text().notNull(),
    content: t.text(),
    ...timestamps,
    ...discordTimestamps,
})

export const messageSelectSchema = createSelectSchema(messages)
export const messageInsertSchema = createInsertSchema(messages)
export const messageUpdateSchema = createUpdateSchema(messages)
