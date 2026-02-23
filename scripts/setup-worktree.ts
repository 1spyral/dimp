import { spawn } from "node:child_process"
import { copyFile, readFile, writeFile } from "node:fs/promises"
import { createServer } from "node:net"
import { resolve } from "node:path"

type RunOptions = {
    cwd?: string
    env?: NodeJS.ProcessEnv
    quiet?: boolean
}

const rootDir = process.cwd()
const composeFile = resolve(rootDir, "docker-compose.worktree.yml")

const requestedPgPort = process.env.DIMP_PG_PORT
const pgDb = process.env.DIMP_POSTGRES_DB ?? "dimp"
const pgUser = process.env.DIMP_POSTGRES_USER ?? "postgres"
const pgPassword = process.env.DIMP_POSTGRES_PASSWORD ?? "postgres"

function log(message: string) {
    console.log(`[worktree:setup] ${message}`)
}

function sleep(ms: number) {
    return new Promise(resolvePromise => setTimeout(resolvePromise, ms))
}

async function isPortAvailable(port: number) {
    return new Promise<boolean>(resolvePromise => {
        const server = createServer()

        server.once("error", () => resolvePromise(false))
        server.once("listening", () => {
            server.close(() => resolvePromise(true))
        })

        server.listen(port, "127.0.0.1")
    })
}

async function resolvePgPort() {
    if (requestedPgPort) {
        return requestedPgPort
    }

    for (let port = 54329; port <= 54359; port++) {
        if (await isPortAvailable(port)) {
            return String(port)
        }
    }

    throw new Error(
        "No free Postgres port found in range 54329-54359 (set DIMP_PG_PORT manually)"
    )
}

async function fileExists(path: string) {
    return Bun.file(path).exists()
}

async function ensureEnvFromExample(workspace: string) {
    const envPath = resolve(rootDir, workspace, ".env")
    const examplePath = resolve(rootDir, workspace, "env.example")

    if (!(await fileExists(examplePath))) {
        throw new Error(`Missing env template: ${examplePath}`)
    }

    await copyFile(examplePath, envPath)
    log(`Reset ${workspace}/.env from ${workspace}/env.example`)

    return envPath
}

async function upsertEnvValue(path: string, key: string, value: string) {
    const original = await readFile(path, "utf8")
    const lines = original.split(/\r?\n/)
    const prefix = `${key}=`
    const index = lines.findIndex(
        line => !line.trimStart().startsWith("#") && line.startsWith(prefix)
    )

    if (index === -1) {
        const next = original.endsWith("\n")
            ? `${original}${prefix}${value}\n`
            : `${original}\n${prefix}${value}\n`
        await writeFile(path, next, "utf8")
        log(`Added ${key} to ${path.replace(`${rootDir}/`, "")}`)
        return
    }

    lines[index] = `${prefix}${value}`
    await writeFile(path, `${lines.join("\n")}\n`, "utf8")
    log(`Set ${key} in ${path.replace(`${rootDir}/`, "")}`)
}

function run(command: string, args: string[], options: RunOptions = {}) {
    return new Promise<void>((resolvePromise, rejectPromise) => {
        const child = spawn(command, args, {
            cwd: options.cwd ?? rootDir,
            env: options.env ?? process.env,
            stdio: options.quiet ? "ignore" : "inherit",
        })

        child.on("error", rejectPromise)
        child.on("close", code => {
            if (code === 0) {
                resolvePromise()
                return
            }

            rejectPromise(
                new Error(
                    `Command failed (${code}): ${[command, ...args].join(" ")}`
                )
            )
        })
    })
}

async function waitForPostgres(composeEnv: NodeJS.ProcessEnv) {
    for (let attempt = 1; attempt <= 30; attempt++) {
        try {
            await run(
                "docker",
                [
                    "compose",
                    "-f",
                    composeFile,
                    "exec",
                    "-T",
                    "postgres",
                    "pg_isready",
                    "-U",
                    pgUser,
                    "-d",
                    pgDb,
                ],
                { env: composeEnv, quiet: true }
            )

            log("Postgres is ready")
            return
        } catch {
            if (attempt === 30) {
                throw new Error("Postgres did not become ready in time")
            }

            await sleep(1000)
        }
    }
}

async function main() {
    const pgPort = await resolvePgPort()
    const composeEnv: NodeJS.ProcessEnv = {
        ...process.env,
        DIMP_PG_PORT: pgPort,
        DIMP_POSTGRES_DB: pgDb,
        DIMP_POSTGRES_USER: pgUser,
        DIMP_POSTGRES_PASSWORD: pgPassword,
    }

    await ensureEnvFromExample("dimp-auth")
    await ensureEnvFromExample("dimp-server")
    await ensureEnvFromExample("dimp-bot")

    const localDatabaseUrl = `postgres://${encodeURIComponent(pgUser)}:${encodeURIComponent(pgPassword)}@127.0.0.1:${pgPort}/${pgDb}`

    await upsertEnvValue(
        resolve(rootDir, "dimp-auth/.env"),
        "DATABASE_URL",
        localDatabaseUrl
    )
    await upsertEnvValue(
        resolve(rootDir, "dimp-server/.env"),
        "DATABASE_URL",
        localDatabaseUrl
    )

    log(`Starting Postgres on localhost:${pgPort}`)
    await run(
        "docker",
        ["compose", "-f", composeFile, "up", "-d", "postgres"],
        {
            env: composeEnv,
        }
    )

    await waitForPostgres(composeEnv)

    log("Running dimp-server migrations")
    await run("bun", ["run", "--cwd", "dimp-server", "db:migrate"])

    log("Running dimp-auth migrations")
    await run("bun", ["run", "--cwd", "dimp-auth", "db:migrate"])

    log("Done")
}

main().catch(error => {
    console.error(
        `[worktree:setup] ${error instanceof Error ? error.message : String(error)}`
    )
    process.exit(1)
})
