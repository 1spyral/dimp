import { JwksStore } from "@/jwks"
import { loggerConfig } from "@/logger"
import { oauthRoutes } from "@/routes/oauth"
import cookie from "@fastify/cookie"
import Fastify from "fastify"

const fastify = Fastify({ logger: loggerConfig })
const jwksStore = new JwksStore()

declare module "fastify" {
    interface FastifyInstance {
        jwksStore: JwksStore
    }
}

fastify.decorate("jwksStore", jwksStore)
fastify.register(cookie)

fastify.get("/", async (_request, reply) => {
    return reply.code(200).type("text/plain").send("Healthcheck passed")
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
