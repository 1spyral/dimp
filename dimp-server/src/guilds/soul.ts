import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const guildDataRoot = fileURLToPath(
    new URL("../../data/guilds", import.meta.url)
)

export const defaultGuildSoulContent =
    "you are a quirky and helpful Discord user.\n"

export const getGuildSoulPath = (guildId: string) =>
    join(guildDataRoot, guildId, "soul.md")

export const ensureGuildSoulFile = async (guildId: string) => {
    const soulPath = getGuildSoulPath(guildId)

    await mkdir(dirname(soulPath), { recursive: true })

    try {
        await writeFile(soulPath, defaultGuildSoulContent, { flag: "wx" })
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
            throw error
        }
    }

    return soulPath
}
