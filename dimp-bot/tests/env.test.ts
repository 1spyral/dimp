import { env, parseEnv } from "@/env"
import { describe, expect, test } from "bun:test"
import { validEnv } from "./fixtures/env"

describe("env", () => {
    test("parses defaults and valid values", () => {
        const parsed = parseEnv({
            ...validEnv,
            PORT: undefined,
            HOST: undefined,
        })

        expect(parsed.NODE_ENV).toBe("test")
        expect(parsed.PORT).toBe(3000)
        expect(parsed.HOST).toBe("0.0.0.0")
        expect(parsed.LOG_LEVEL).toBe("info")
        expect(parsed.DISCORD_CLIENT_ID).toBe("1234567890")
    })

    test("rejects invalid GraphQL API URLs", () => {
        expect(() =>
            parseEnv({
                ...validEnv,
                GRAPHQL_API_URL: "not-a-url",
            })
        ).toThrow("Invalid GRAPHQL_API_URL")
    })

    test("loads the shared test environment file", () => {
        expect(env.NODE_ENV).toBe("test")
        expect(env.PORT).toBe(3001)
        expect(env.HOST).toBe("127.0.0.1")
        expect(env.LOG_LEVEL).toBe("info")
    })
})
