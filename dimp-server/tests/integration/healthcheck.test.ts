import { server } from "@/server"
import { describe, expect, test } from "bun:test"

describe("integration: healthcheck", () => {
    test("GET / returns a healthy healthcheck response", async () => {
        const response = await server.handle(
            new Request("http://localhost/", { method: "GET" })
        )

        expect(response.status).toBe(200)
        expect(response.headers.get("content-type")).toContain("text/plain")
        expect(await response.text()).toBe("Healthcheck healthy")
    })
})
