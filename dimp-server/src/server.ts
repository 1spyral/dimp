import { db } from "@/drizzle"
import { env } from "@/env"
import { logger } from "@/logger"
import { schema } from "@graphql"
import { yoga } from "@elysiajs/graphql-yoga"
import { Elysia } from "elysia"

const server = new Elysia()

let agentsPromise: Promise<typeof import("@/ai/workflows")> | undefined

const getAgents = () => {
    agentsPromise ??= import("@/ai/workflows")

    return agentsPromise
}

server.use(
    yoga({
        schema,
        graphiql: env.NODE_ENV === "development",
        context: async ({ request }) => ({
            request,
            reply: null,
            db,
            agents: await getAgents(),
            logger,
        }),
    })
).get("/", () => {
    return new Response("Healthcheck healthy", {
        status: 200,
        headers: { "content-type": "text/plain" },
    })
})

export { server }
