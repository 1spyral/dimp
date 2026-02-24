import { db } from "@/drizzle"
import { env } from "@/env"
import { logger } from "@/logger"
import { yoga } from "@elysiajs/graphql-yoga"
import { schema } from "@graphql"
import { Elysia } from "elysia"

const server = new Elysia()

let agentsPromise: Promise<typeof import("@/ai/workflows")> | undefined

const getAgents = () => {
    agentsPromise ??= import("@/ai/workflows")

    return agentsPromise
}

const createRequestLogger = (request: Request) => {
    const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID()

    let path = request.url
    try {
        path = new URL(request.url).pathname
    } catch {
        // Keep the raw URL if parsing fails in a test or non-standard runtime.
    }

    return logger.child({
        requestId,
        method: request.method,
        path,
    })
}

server
    .use(
        yoga({
            schema,
            graphiql: env.NODE_ENV === "development",
            context: async ({ request }) => ({
                request,
                reply: null,
                db,
                getAgents,
                logger: createRequestLogger(request),
            }),
        })
)
    .get("/readyz", ({ set }) => {
        set.headers["content-type"] = "text/plain"
        return "Ready"
    })
    .get("/livez", ({ set }) => {
        set.headers["content-type"] = "text/plain"
        return "Live"
    })
    .get("/", ({ set }) => {
        set.headers["content-type"] = "text/plain"
        set.headers.Deprecation = "true"
        set.headers.Link =
            '</readyz>; rel="successor-version", </livez>; rel="successor-version"'
        set.headers.Warning =
            '299 - "Deprecated healthcheck endpoint. Use /readyz or /livez instead."'

        return "Healthcheck healthy"
    })

export { server }
