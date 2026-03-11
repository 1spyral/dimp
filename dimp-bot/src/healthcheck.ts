import { env } from "@/env"
import { logger } from "@/logger"

type HealthcheckState = {
    isLive: () => boolean
    isReady: () => boolean
}

const textHeaders = {
    "content-type": "text/plain",
}

const deprecatedHeaders = {
    ...textHeaders,
    deprecation: "true",
    link: '</readyz>; rel="successor-version", </livez>; rel="successor-version"',
    warning:
        '299 - "Deprecated healthcheck endpoint. Use /readyz or /livez instead."',
}

const createTextResponse = (body: string, status = 200) =>
    new Response(body, {
        status,
        headers: textHeaders,
    })

export const startHealthcheckServer = (state: HealthcheckState) => {
    const server = Bun.serve({
        hostname: env.HOST,
        port: env.PORT,
        fetch(request) {
            const pathname = new URL(request.url).pathname

            if (pathname === "/readyz") {
                return state.isReady()
                    ? createTextResponse("Ready")
                    : createTextResponse("Not Ready", 503)
            }

            if (pathname === "/livez") {
                return state.isLive()
                    ? createTextResponse("Live")
                    : createTextResponse("Not Live", 503)
            }

            if (pathname === "/") {
                return new Response("Healthcheck healthy", {
                    status: state.isLive() ? 200 : 503,
                    headers: deprecatedHeaders,
                })
            }

            return createTextResponse("Not Found", 404)
        },
    })

    logger.info(
        {
            host: env.HOST,
            port: env.PORT,
        },
        "Healthcheck server listening"
    )

    return server
}
