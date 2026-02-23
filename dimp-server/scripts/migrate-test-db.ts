import { db, pgClient } from "@/drizzle"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import { fileURLToPath } from "node:url"

const migrationsFolder = fileURLToPath(new URL("../drizzle", import.meta.url))

const run = async () => {
    try {
        await pgClient`select 1`
        await migrate(db, { migrationsFolder })
        console.log("Test database migrations applied")
    } finally {
        await pgClient.end()
    }
}

await run()
