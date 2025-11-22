import Fastify from "fastify"
import mercurius from "mercurius"
import { db } from "@/drizzle"
import { schema } from "@graphql"

const fastify = Fastify({ logger: true })

fastify.register(mercurius, {
    schema,
    graphiql: true,
    context: (request, reply) => ({ request, reply, db }),
})

fastify.get("/", async (_request, reply) => {
    return reply.code(200).type("text/plain").send("Healthcheck healthy")
})

export { fastify as server }
