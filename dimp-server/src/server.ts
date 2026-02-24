import { db } from "@/drizzle"
import { env } from "@/env"
import { logger } from "@/logger"
import { schema } from "@graphql"
import { yoga } from "@elysiajs/graphql-yoga"
import { Elysia } from "elysia"

interface InjectOptions {
    method?: string
    url: string
    headers?: Record<string, string>
    payload?: unknown
}

interface InjectResponse {
    statusCode: number
    headers: Record<string, string>
    body: string
    json: <T = unknown>() => T
}

interface ListenOptions {
    port: number
    host: string
}

interface Server {
    log: typeof logger
    listen: (options: ListenOptions) => Promise<void>
    ready: () => Promise<void>
    close: () => Promise<void>
    inject: (options: InjectOptions) => Promise<InjectResponse>
}

const app = new Elysia()

let agentsPromise: Promise<typeof import("@/ai/workflows")> | undefined

const getAgents = () => {
    agentsPromise ??= import("@/ai/workflows")

    return agentsPromise
}

app.use(
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
)

app.get("/", () => {
    return new Response("Healthcheck healthy", {
        status: 200,
        headers: { "content-type": "text/plain" },
    })
})

const inject = async ({
    method = "GET",
    url,
    headers = {},
    payload,
}: InjectOptions): Promise<InjectResponse> => {
    const requestHeaders = new Headers(headers)

    let body: BodyInit | undefined
    if (payload !== undefined) {
        if (
            typeof payload === "string" ||
            payload instanceof ArrayBuffer ||
            payload instanceof Blob ||
            payload instanceof FormData ||
            payload instanceof URLSearchParams
        ) {
            body = payload
        } else {
            if (!requestHeaders.has("content-type")) {
                requestHeaders.set("content-type", "application/json")
            }
            body = JSON.stringify(payload)
        }
    }

    const response = await app.handle(
        new Request(new URL(url, "http://localhost"), {
            method,
            headers: requestHeaders,
            body,
        })
    )

    const responseBody = await response.text()

    return {
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseBody,
        json: <T = unknown>() => JSON.parse(responseBody) as T,
    }
}

export const server: Server = {
    log: logger,
    listen: async ({ port, host }) => {
        app.listen({ port, hostname: host })
    },
    ready: async () => {
        app.compile()
        await app.modules
    },
    close: async () => {
        if (app.server) {
            await app.stop()
        }
    },
    inject,
}
