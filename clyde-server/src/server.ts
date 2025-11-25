import Fastify from "fastify"
import mercurius from "mercurius"
import { db } from "@/drizzle"
import { env } from "@/env"
import { loggerConfig } from "@/logger"
import { schema } from "@graphql"

const fastify = Fastify({ logger: loggerConfig })

fastify.register(mercurius, {
    schema,
    graphiql: env.NODE_ENV === "development",
    context: (request, reply) => ({ request, reply, db }),
})

fastify.get("/", async (_request, reply) => {
    return reply.code(200).type("text/plain").send("Healthcheck healthy")
})

export { fastify as server }
