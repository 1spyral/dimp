import { pgTable } from "drizzle-orm/pg-core"
import * as t from "drizzle-orm/pg-core"
import { timestamps } from "@/db/columns.helpers"

export const oauthRefreshTokens = pgTable(
    "oauth_refresh_tokens",
    {
        id: t.serial().primaryKey(),
        userId: t.text().notNull(),
        tokenHash: t.text().notNull(),
        expiresAt: t.timestamp().notNull(),
        revokedAt: t.timestamp(),
        replacedByTokenHash: t.text(),
        ...timestamps,
    },
    table => [
        t.index().on(table.userId),
        t.unique().on(table.tokenHash),
        t.index().on(table.expiresAt),
    ]
)
