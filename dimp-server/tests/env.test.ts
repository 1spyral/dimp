import { env, parseEnv } from "@/env"
import { describe, expect, test } from "bun:test"
import { validEnv } from "./fixtures/env"

describe("env", () => {
    test("parses and applies defaults/coercion", () => {
        const parsed = parseEnv({
            ...validEnv,
            PORT: undefined,
            HOST: undefined,
            DB_MAX_CONNECTIONS: "12",
            DB_IDLE_TIMEOUT: undefined,
            DB_CONNECT_TIMEOUT: undefined,
        })

        expect(parsed.NODE_ENV).toBe("test")
        expect(parsed.PORT).toBe(3000)
        expect(parsed.HOST).toBe("0.0.0.0")
        expect(parsed.DB_MAX_CONNECTIONS).toBe(12)
        expect(parsed.DB_IDLE_TIMEOUT).toBe(30)
        expect(parsed.DB_CONNECT_TIMEOUT).toBe(30)
    })

    test("throws for invalid database url", () => {
        expect(() =>
            parseEnv({
                ...validEnv,
                DATABASE_URL: "not-a-url",
            })
        ).toThrow()
    })

    test("loads the shared test environment file", () => {
        expect(env.NODE_ENV).toBe("test")
        expect(env.PORT).toBe(3001)
        expect(env.HOST).toBe("127.0.0.1")
        expect(env.LOG_LEVEL).toBe("info")
    })
})
