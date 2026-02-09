import { exportJWK, generateKeyPair, type JWK } from "jose"
import { randomUUID } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname } from "node:path"
import { parseArgs } from "node:util"

type StoredKey = {
    kid: string
    alg: string
    use: "sig"
    createdAt: string
    publicJwk: JWK
    privateJwk: JWK
}

type JwksFile = {
    keys: StoredKey[]
}

const preferEnv = (value: string | undefined, fallback: string) => {
    return value && value.trim() !== "" ? value : fallback
}

const envDefaults = {
    file: preferEnv(Bun.env.JWKS_FILE, "keys/jwks.json"),
    maxActive: preferEnv(Bun.env.JWKS_MAX_ACTIVE, "3"),
    alg: preferEnv(Bun.env.JWKS_ALG, "RS256"),
}

const args = parseArgs({
    args: Bun.argv.slice(2),
    options: {
        file: { type: "string", default: envDefaults.file },
        "max-active": { type: "string", default: envDefaults.maxActive },
        alg: { type: "string", default: envDefaults.alg },
        help: { type: "boolean", default: false },
    },
    allowPositionals: false,
})

if (args.values.help) {
    console.log(`Usage: bun run scripts/jwks.ts [--file path] [--max-active N] [--alg RS256]

Rotates JWKS keys by generating a new signing key and trimming to the latest N keys.
The newest key is last in the file and should be used for signing.`)
    process.exit(0)
}

const filePath = args.values.file
const maxActive = Number(args.values["max-active"])
const alg = args.values.alg

if (!Number.isInteger(maxActive) || maxActive < 1) {
    throw new Error("--max-active must be a positive integer")
}

const loadKeys = async (): Promise<JwksFile> => {
    try {
        const raw = await readFile(filePath, "utf8")
        const parsed = JSON.parse(raw) as JwksFile
        if (!parsed || !Array.isArray(parsed.keys)) {
            throw new Error("Invalid JWKS file format")
        }
        return parsed
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
            return { keys: [] }
        }
        throw err
    }
}

const generateKey = async (): Promise<StoredKey> => {
    const { publicKey, privateKey } = await generateKeyPair(alg, {
        modulusLength: alg.startsWith("RS") ? 2048 : undefined,
        extractable: true,
    })
    const kid = `jwks-${Date.now()}-${randomUUID().slice(0, 8)}`
    const createdAt = new Date().toISOString()
    const publicJwk = await exportJWK(publicKey)
    const privateJwk = await exportJWK(privateKey)

    publicJwk.kid = kid
    publicJwk.use = "sig"
    publicJwk.alg = alg
    privateJwk.kid = kid
    privateJwk.use = "sig"
    privateJwk.alg = alg

    return {
        kid,
        alg,
        use: "sig",
        createdAt,
        publicJwk,
        privateJwk,
    }
}

const rotate = async () => {
    const existing = await loadKeys()
    const nextKey = await generateKey()

    const combined = [...existing.keys, nextKey].sort(
        (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    const trimmed = combined.slice(-maxActive)

    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, JSON.stringify({ keys: trimmed }, null, 2))

    console.log(
        `JWKS rotated: kid=${nextKey.kid} active=${trimmed.length} file=${filePath}`
    )
}

await rotate()
