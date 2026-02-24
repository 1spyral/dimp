import { server } from "@/server"
import { describe, expect, test } from "bun:test"

describe("integration: healthcheck", () => {
    test("GET /readyz returns a ready response", async () => {
        const response = await server.handle(
            new Request("http://localhost/readyz", { method: "GET" })
        )

        expect(response.status).toBe(200)
        expect(response.headers.get("content-type")).toContain("text/plain")
        expect(await response.text()).toBe("Ready")
    })

    test("GET /livez returns a live response", async () => {
        const response = await server.handle(
            new Request("http://localhost/livez", { method: "GET" })
        )

        expect(response.status).toBe(200)
        expect(response.headers.get("content-type")).toContain("text/plain")
        expect(await response.text()).toBe("Live")
    })

    test("GET / returns a deprecated healthcheck response", async () => {
        const response = await server.handle(
            new Request("http://localhost/", { method: "GET" })
        )

        expect(response.status).toBe(200)
        expect(response.headers.get("content-type")).toContain("text/plain")
        expect(response.headers.get("deprecation")).toBe("true")
        expect(response.headers.get("link")).toContain("</readyz>")
        expect(response.headers.get("link")).toContain("</livez>")
        expect(response.headers.get("warning")).toContain(
            "Deprecated healthcheck endpoint"
        )
        expect(await response.text()).toBe("Healthcheck healthy")
    })
})
