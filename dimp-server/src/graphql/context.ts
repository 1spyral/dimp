import * as schema from "@schema"
import type { BunSQLDatabase } from "drizzle-orm/bun-sql"
import type { FastifyBaseLogger, FastifyReply, FastifyRequest } from "fastify"

export interface Context {
    request: FastifyRequest
    reply: FastifyReply
    db: BunSQLDatabase<typeof schema>
    getAgents: () => Promise<typeof import("@/ai/workflows")>
    logger: FastifyBaseLogger
}
