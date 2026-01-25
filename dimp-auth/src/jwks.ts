import { readFile } from "node:fs/promises"
import { watch } from "node:fs"
import { env } from "@/env"
import { logger } from "@/logger"

export type Jwk = Record<string, string>

export type JwksEntry = {
    kid: string
    alg?: string
    use?: string
    createdAt?: string
    publicJwk: Jwk
    privateJwk?: Jwk
}

export type JwksFile = {
    keys: JwksEntry[]
}

export class JwksStore {
    private jwks: JwksFile | null = null
    private watcher: ReturnType<typeof watch> | null = null
    private reloadTimer: NodeJS.Timeout | null = null
    private loading: Promise<void> | null = null

    constructor(private readonly filePath: string = env.JWKS_FILE) {}

    async start(): Promise<void> {
        await this.load()
        this.startWatching()
    }

    stop(): void {
        if (this.watcher) {
            this.watcher.close()
            this.watcher = null
        }
        if (this.reloadTimer) {
            clearTimeout(this.reloadTimer)
            this.reloadTimer = null
        }
    }

    getJwks(): JwksFile {
        if (!this.jwks) {
            throw new Error("JWKS not loaded")
        }
        return this.jwks
    }

    getPublicJwks(): { keys: Jwk[] } {
        const jwks = this.getJwks()
        return { keys: jwks.keys.map(entry => entry.publicJwk) }
    }

    private startWatching(): void {
        if (this.watcher) {
            return
        }

        this.watcher = watch(this.filePath, { persistent: false }, () => {
            this.scheduleReload()
        })
    }

    private scheduleReload(): void {
        if (this.reloadTimer) {
            return
        }

        this.reloadTimer = setTimeout(() => {
            this.reloadTimer = null
            void this.load()
        }, 50)
    }

    private async load(): Promise<void> {
        if (this.loading) {
            return this.loading
        }

        this.loading = (async () => {
            try {
                const contents = await readFile(this.filePath, "utf8")
                const parsed = JSON.parse(contents) as JwksFile
                if (!parsed || !Array.isArray(parsed.keys)) {
                    throw new Error("JWKS file missing keys array")
                }
                this.jwks = parsed
            } catch (err) {
                logger.error(
                    { err, filePath: this.filePath },
                    "Failed to load JWKS file"
                )
            } finally {
                this.loading = null
            }
        })()

        return this.loading
    }
}
