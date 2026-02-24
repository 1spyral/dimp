import { pgClient } from "@/drizzle"
import { env } from "@/env"
import { logger } from "@/logger"
import { server } from "@/server"

const start = async () => {
    try {
        await pgClient`select 1`
        logger.info("Database connection check OK")

        server.listen({ port: env.PORT, hostname: env.HOST })
        logger.info(`Server running on ${env.HOST}:${env.PORT}`)
    } catch (err) {
        logger.error(err)
        process.exit(1)
    }
}

start()
