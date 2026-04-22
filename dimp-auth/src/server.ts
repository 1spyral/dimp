import { JwksStore } from "@/jwks"
import { loggerConfig } from "@/logger"
import { oauthRoutes } from "@/routes/oauth"
import cookie from "@fastify/cookie"
import Fastify from "fastify"

const HEALTHCHECK_PATHS = new Set(["/", "/readyz", "/livez"])

const deprecatedHealthcheckHeaders = {
    Deprecation: "true",
    Link: '</readyz>; rel="successor-version", </livez>; rel="successor-version"',
    Warning:
        '299 - "Deprecated healthcheck endpoint. Use /readyz or /livez instead."',
}

const getRequestPath = (url: string) => url.split("?", 1)[0] || "/"

const fastify = Fastify({
    logger: loggerConfig,
    disableRequestLogging: request =>
        HEALTHCHECK_PATHS.has(getRequestPath(request.url)),
})
const jwksStore = new JwksStore()

declare module "fastify" {
    interface FastifyInstance {
        jwksStore: JwksStore
    }
}

fastify.decorate("jwksStore", jwksStore)
fastify.register(cookie)

fastify.get("/readyz", async (_request, reply) => {
    return reply.code(200).type("text/plain").send("Ready")
})

fastify.get("/livez", async (_request, reply) => {
    return reply.code(200).type("text/plain").send("Live")
})

fastify.get("/", async (_request, reply) => {
    for (const [header, value] of Object.entries(
        deprecatedHealthcheckHeaders
    )) {
        reply.header(header, value)
    }

    return reply.code(200).type("text/plain").send("Healthcheck healthy")
})

fastify.get("/.well-known/jwks.json", async (_request, reply) => {
    return reply.code(200).send(jwksStore.getPublicJwks())
})

fastify.register(oauthRoutes, { prefix: "/oauth" })

fastify.addHook("onReady", async () => {
    await jwksStore.start()
})

fastify.addHook("onClose", async () => {
    jwksStore.stop()
})

export { fastify as server }
