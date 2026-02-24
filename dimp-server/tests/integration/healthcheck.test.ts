import { server } from "@/server"
import { describe, expect, test } from "bun:test"

describe("integration: healthcheck", () => {
    test("GET / returns a healthy healthcheck response", async () => {
        const response = await server.inject({
            method: "GET",
            url: "/",
        })

        expect(response.statusCode).toBe(200)
        expect(response.headers["content-type"]).toContain("text/plain")
        expect(response.body).toBe("Healthcheck healthy")
    })
})
