import type { BunSQLDatabase } from "drizzle-orm/bun-sql"
import type { FastifyReply, FastifyRequest } from "fastify"
import * as schema from "@schema"

export interface Context {
    request: FastifyRequest
    reply: FastifyReply
    db: BunSQLDatabase<typeof schema>
}
