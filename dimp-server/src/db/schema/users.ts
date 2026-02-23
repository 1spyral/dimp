import { timestamps } from "@/db/columns.helpers"
import * as t from "drizzle-orm/pg-core"
import { pgTable } from "drizzle-orm/pg-core"
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod"

export const users = pgTable("users", {
    id: t.text().primaryKey(),
    username: t.text().notNull(),
    discriminator: t.text().notNull(),
    ...timestamps,
})

export const userSelectSchema = createSelectSchema(users)
export const userInsertSchema = createInsertSchema(users)
export const userUpdateSchema = createUpdateSchema(users)
