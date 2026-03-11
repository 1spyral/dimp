import {
    createLoggerConfig,
    loggerConfig,
    serializeErrorForLogging,
} from "@/logger"
import { describe, expect, test } from "bun:test"

describe("logger", () => {
    test("uses env log level", () => {
        expect(loggerConfig.level).toBe("info")
    })

    test("enables pretty transport only in development", () => {
        expect(loggerConfig.transport).toBeUndefined()
        expect(
            createLoggerConfig({
                NODE_ENV: "development",
                LOG_LEVEL: "debug",
            }).transport
        ).toMatchObject({
            target: "pino-pretty",
        })
    })

    test("serializes circular error payloads safely", () => {
        const context: Record<string, unknown> = {}
        context.self = context

        const error = new Error("boom") as Error & {
            context?: Record<string, unknown>
            cause?: unknown
        }
        error.context = context
        error.cause = context

        const serialized = serializeErrorForLogging(error)

        expect(serialized).toMatchObject({
            type: "Error",
            message: "boom",
            details: {
                context: {
                    self: "[Circular]",
                },
            },
        })
        expect(serialized.cause).toBe("[Circular]")
        expect(() => JSON.stringify(serialized)).not.toThrow()
    })
})
