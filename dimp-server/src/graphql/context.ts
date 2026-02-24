import * as schema from "@schema"
import type { BunSQLDatabase } from "drizzle-orm/bun-sql"

export interface ContextLogger {
    error: (...args: unknown[]) => void
}

export interface Context {
    request: Request
    reply: null
    db: BunSQLDatabase<typeof schema>
    getAgents: () => Promise<typeof import("@/ai/workflows")>
    logger: ContextLogger
}
