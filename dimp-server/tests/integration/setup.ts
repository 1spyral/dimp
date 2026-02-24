import { pgClient } from "@/drizzle"
import { server } from "@/server"
import { afterAll, beforeAll, beforeEach } from "bun:test"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import { fileURLToPath } from "node:url"
import "../setup"

declare global {
    var __dimpIntegrationHooksRegistered: boolean | undefined
}

const migrationsFolder = fileURLToPath(
    new URL("../../drizzle", import.meta.url)
)

if (!globalThis.__dimpIntegrationHooksRegistered) {
    globalThis.__dimpIntegrationHooksRegistered = true

    beforeAll(async () => {
        await pgClient`select 1`
        // Make direct `bun run test:integration` usable after starting Postgres.
        await migrate((await import("@/drizzle")).db, { migrationsFolder })
        server.compile()
        await server.modules
    })

    beforeEach(async () => {
        await pgClient`
            TRUNCATE TABLE "messages", "users" RESTART IDENTITY CASCADE
        `
    })

    afterAll(async () => {
        if (server.server) {
            await server.stop()
        }
        await pgClient.end()
    })
}
