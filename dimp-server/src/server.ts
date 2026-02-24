import { db } from "@/drizzle"
import { env } from "@/env"
import { loggerConfig } from "@/logger"
import { schema } from "@graphql"
import Fastify from "fastify"
import mercurius from "mercurius"

const fastify = Fastify({ logger: loggerConfig })
let agentsPromise: Promise<typeof import("@/ai/workflows")> | undefined

const getAgents = () => {
    agentsPromise ??= import("@/ai/workflows")

    return agentsPromise
}

fastify.register(mercurius, {
    schema,
    graphiql: env.NODE_ENV === "development",
    context: async (request, reply) => ({
        request,
        reply,
        db,
        getAgents,
        logger: request.log,
    }),
})

fastify.get("/", async (_request, reply) => {
    return reply.code(200).type("text/plain").send("Healthcheck healthy")
})

export { fastify as server }
