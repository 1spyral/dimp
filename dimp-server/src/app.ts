import { pgClient } from "@/drizzle"
import { env } from "@/env"
import { logger, serializeErrorForLogging } from "@/logger"
import { server } from "@/server"

const start = async () => {
    try {
        await pgClient`select 1`
        logger.info("Database connection check OK")

        server.listen({ port: env.PORT, hostname: env.HOST })
        logger.info(`Server running on ${env.HOST}:${env.PORT}`)
    } catch (err) {
        logger.error(
            {
                error: serializeErrorForLogging(err),
            },
            "server startup failed"
        )
        process.exit(1)
    }
}

start()
