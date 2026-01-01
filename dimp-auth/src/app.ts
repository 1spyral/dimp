import { env } from "@/env"
import { server } from "@/server"

const start = async () => {
    try {
        await server.listen({ port: env.PORT })
        server.log.info(`Server running on port ${env.PORT}`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()
