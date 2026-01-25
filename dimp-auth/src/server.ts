import Fastify from "fastify"
import { loggerConfig } from "@/logger"
import { JwksStore } from "@/jwks"
import rateLimit from "@fastify/rate-limit"

const fastify = Fastify({ logger: loggerConfig })
const jwksStore = new JwksStore()

// Apply global rate limiting to all routes to mitigate DoS via expensive operations.
fastify.register(rateLimit, {
    max: 100, // maximum number of requests per time window
    timeWindow: "1 minute", // time window for rate limiting
})

fastify.get("/", async (_request, reply) => {
    return reply.code(200).type("text/plain").send("Healthcheck passed")
})

fastify.get("/.well-known/jwks.json", async (_request, reply) => {
    return reply.code(200).send(jwksStore.getPublicJwks())
})

fastify.addHook("onReady", async () => {
    await jwksStore.start()
})

fastify.addHook("onClose", async () => {
    jwksStore.stop()
})

export { fastify as server }
