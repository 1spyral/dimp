import { pgClient } from "@/drizzle"
import { server } from "@/server"
import { afterAll, beforeAll, beforeEach } from "bun:test"
import "../setup"

declare global {
    var __dimpIntegrationHooksRegistered: boolean | undefined
}

if (!globalThis.__dimpIntegrationHooksRegistered) {
    globalThis.__dimpIntegrationHooksRegistered = true

    beforeAll(async () => {
        await pgClient`select 1`
        await server.ready()
    })

    beforeEach(async () => {
        await pgClient`
            TRUNCATE TABLE "messages", "users" RESTART IDENTITY CASCADE
        `
    })

    afterAll(async () => {
        await server.close()
        await pgClient.end()
    })
}
