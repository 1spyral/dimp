import { pgTable } from "drizzle-orm/pg-core"
import * as t from "drizzle-orm/pg-core"
import { timestamps } from "@/db/columns.helpers"

export const oauthTokens = pgTable(
    "oauth_tokens",
    {
        id: t.serial().primaryKey(),
        userId: t.text().notNull(),
        accessToken: t.text().notNull(),
        oauthProvider: t.text().notNull(),
        ...timestamps,
    },
    table => [t.index().on(table.userId)]
)
