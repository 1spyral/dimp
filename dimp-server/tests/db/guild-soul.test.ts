import { DEFAULT_GUILD_SOUL } from "@/guilds/soul"
import { describe, expect, test } from "bun:test"

describe("DEFAULT_GUILD_SOUL", () => {
    test("loads the default soul from the text file", () => {
        expect(DEFAULT_GUILD_SOUL).toBe(
            "you are a quirky and helpful Discord user."
        )
    })
})
