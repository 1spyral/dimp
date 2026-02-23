import { loggerConfig } from "@/logger"
import { describe, expect, test } from "bun:test"

describe("loggerConfig", () => {
    test("uses env log level", () => {
        expect(loggerConfig.level).toBe("info")
    })

    test("does not enable pretty transport outside development", () => {
        expect(loggerConfig.transport).toBeUndefined()
    })
})
