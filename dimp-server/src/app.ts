import { env } from "@/env"
import { pgClient } from "@/drizzle"
import { server } from "@/server"

const start = async () => {
    try {
        await pgClient`select 1`
        server.log.info("Database connection check OK")

        await server.listen({ port: env.PORT, host: env.HOST })
        server.log.info(`Server running on ${env.HOST}:${env.PORT}`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()
