import { server } from "@/server"
import { describe, expect, test } from "bun:test"

describe("integration: healthcheck", () => {
    test("GET /readyz returns a ready response", async () => {
        const response = await server.inject({
            method: "GET",
            url: "/readyz",
        })

        expect(response.statusCode).toBe(200)
        expect(response.headers["content-type"]).toContain("text/plain")
        expect(response.body).toBe("Ready")
    })

    test("GET /livez returns a live response", async () => {
        const response = await server.inject({
            method: "GET",
            url: "/livez",
        })

        expect(response.statusCode).toBe(200)
        expect(response.headers["content-type"]).toContain("text/plain")
        expect(response.body).toBe("Live")
    })
})
