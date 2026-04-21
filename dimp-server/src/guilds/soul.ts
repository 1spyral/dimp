import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const defaultGuildSoulPath = fileURLToPath(
    new URL("./default_soul.txt", import.meta.url)
)

export const DEFAULT_GUILD_SOUL = readFileSync(
    defaultGuildSoulPath,
    "utf8"
).trim()
