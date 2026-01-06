import { env } from "@/env"
import { server } from "@/server"

const start = async () => {
    try {
        await server.listen({ port: env.PORT, host: env.HOST })
        server.log.info(`Server running on ${env.HOST}:${env.PORT}`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()
