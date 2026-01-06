import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { env } from "@/env"
import * as schema from "@schema"

export const pgClient = postgres(env.DATABASE_URL, {
    max: env.DB_MAX_CONNECTIONS,
    idle_timeout: env.DB_IDLE_TIMEOUT,
    connect_timeout: env.DB_CONNECT_TIMEOUT,
    prepare: false,
})

export const db = drizzle(pgClient, { schema, casing: "snake_case" })
