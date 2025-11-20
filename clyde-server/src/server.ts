import Fastify from "fastify"

const fastify = Fastify({ logger: true })

fastify.get("/", async (request, reply) => {
    return reply.code(200).type("text/plain").send("Healthcheck healthy")
})

export { fastify as server }
