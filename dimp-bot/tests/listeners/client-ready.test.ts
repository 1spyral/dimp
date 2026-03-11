import { createClientReadyHandler } from "@/listeners/ClientReady/once"
import { describe, expect, mock, test } from "bun:test"

describe("ClientReady", () => {
    test("logs the connected user tag and command count", () => {
        const info = mock(() => {})
        const handler = createClientReadyHandler({
            getCommandCount: () => 3,
            logger: { info },
        })

        handler({
            user: {
                tag: "dimp#1234",
            },
        })

        expect(info).toHaveBeenNthCalledWith(1, "Logged in as dimp#1234")
        expect(info).toHaveBeenNthCalledWith(2, "3 commands loaded.")
    })
})
