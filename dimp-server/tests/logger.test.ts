import { loggerConfig, serializeErrorForLogging } from "@/logger"
import { describe, expect, test } from "bun:test"

describe("loggerConfig", () => {
    test("uses env log level", () => {
        expect(loggerConfig.level).toBe("info")
    })

    test("does not enable pretty transport outside development", () => {
        expect(loggerConfig.transport).toBeUndefined()
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

    test("serializes non-Error objects with non-enumerable name and message", () => {
        const errorLike = {
            specifier: "@langchain/core/utils/standard_schema",
        }

        Object.defineProperties(errorLike, {
            name: {
                value: "ResolveMessage",
                enumerable: false,
            },
            message: {
                value: "Cannot find module '@langchain/core/utils/standard_schema'",
                enumerable: false,
            },
        })

        expect(serializeErrorForLogging(errorLike)).toEqual({
            type: "ResolveMessage",
            message:
                "Cannot find module '@langchain/core/utils/standard_schema'",
            details: {
                specifier: "@langchain/core/utils/standard_schema",
            },
        })
    })
})
