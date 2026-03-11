import { createHealthcheckFetch } from "@/healthcheck"
import { describe, expect, test } from "bun:test"

const request = (path: string) => new Request(`http://localhost${path}`)

describe("healthcheck", () => {
    test("returns ready and live responses when healthy", async () => {
        const fetch = createHealthcheckFetch({
            isLive: () => true,
            isReady: () => true,
        })

        const ready = await fetch(request("/readyz"))
        const live = await fetch(request("/livez"))
        const root = await fetch(request("/"))
        const notFound = await fetch(request("/missing"))

        expect(ready.status).toBe(200)
        expect(await ready.text()).toBe("Ready")

        expect(live.status).toBe(200)
        expect(await live.text()).toBe("Live")

        expect(root.status).toBe(200)
        expect(root.headers.get("deprecation")).toBe("true")
        expect(root.headers.get("link")).toContain("</readyz>")
        expect(root.headers.get("link")).toContain("</livez>")
        expect(await root.text()).toBe("Healthcheck healthy")

        expect(notFound.status).toBe(404)
        expect(await notFound.text()).toBe("Not Found")
    })

    test("returns unhealthy responses when not ready or live", async () => {
        const fetch = createHealthcheckFetch({
            isLive: () => false,
            isReady: () => false,
        })

        const ready = await fetch(request("/readyz"))
        const live = await fetch(request("/livez"))
        const root = await fetch(request("/"))

        expect(ready.status).toBe(503)
        expect(await ready.text()).toBe("Not Ready")

        expect(live.status).toBe(503)
        expect(await live.text()).toBe("Not Live")

        expect(root.status).toBe(503)
        expect(await root.text()).toBe("Healthcheck healthy")
    })
})
