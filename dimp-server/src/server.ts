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

server.use(
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
    .get("/readyz", () => {
        return new Response("Ready", {
            status: 200,
            headers: { "content-type": "text/plain" },
        })
    })
    .get("/livez", () => {
        return new Response("Live", {
            status: 200,
            headers: { "content-type": "text/plain" },
        })
    })
    .get("/", () => {
        return new Response("Healthcheck healthy", {
            status: 200,
            headers: {
                "content-type": "text/plain",
                Deprecation: "true",
                Link: '</readyz>; rel="successor-version", </livez>; rel="successor-version"',
                Warning:
                    '299 - "Deprecated healthcheck endpoint. Use /readyz or /livez instead."',
            },
        })
    })

export { server }
