import Fastify from "fastify"
import { loggerConfig } from "@/logger"

const fastify = Fastify({ logger: loggerConfig })

fastify.get("/", async (_request, reply) => {
    return reply.code(200).type("text/plain").send("Healthcheck passed")
})

export { fastify as server }
