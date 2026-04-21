import { timestamps } from "@/db/columns.helpers"
import { DEFAULT_GUILD_SOUL } from "@/guilds/soul"
import * as t from "drizzle-orm/pg-core"
import { pgTable } from "drizzle-orm/pg-core"
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-typebox"

export const guilds = pgTable("guilds", {
    id: t.text().primaryKey(),
    name: t.text().notNull(),
    soul: t.text().notNull().default(DEFAULT_GUILD_SOUL),
    ...timestamps,
})

export const guildSelectSchema = createSelectSchema(guilds)
export const guildInsertSchema = createInsertSchema(guilds)
export const guildUpdateSchema = createUpdateSchema(guilds)
