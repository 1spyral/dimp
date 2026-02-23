import { spawn } from "node:child_process"
import { rm } from "node:fs/promises"
import { resolve } from "node:path"

type RunOptions = {
    cwd?: string
    env?: NodeJS.ProcessEnv
}

const rootDir = process.cwd()
const composeFile = resolve(rootDir, "docker-compose.worktree.yml")

function log(message: string) {
    console.log(`[worktree:teardown] ${message}`)
}

async function fileExists(path: string) {
    return Bun.file(path).exists()
}

function run(command: string, args: string[], options: RunOptions = {}) {
    return new Promise<void>((resolvePromise, rejectPromise) => {
        const child = spawn(command, args, {
            cwd: options.cwd ?? rootDir,
            env: options.env ?? process.env,
            stdio: "inherit",
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

async function removeEnvFile(workspace: string) {
    const envPath = resolve(rootDir, workspace, ".env")

    if (!(await fileExists(envPath))) {
        log(`${workspace}/.env not present`)
        return
    }

    await rm(envPath)
    log(`Removed ${workspace}/.env`)
}

async function main() {
    log("Stopping and removing Postgres container + volume")
    await run("docker", [
        "compose",
        "-f",
        composeFile,
        "down",
        "--volumes",
        "--remove-orphans",
    ])

    await removeEnvFile("dimp-auth")
    await removeEnvFile("dimp-server")
    await removeEnvFile("dimp-bot")

    log("Done")
}

main().catch(error => {
    console.error(
        `[worktree:teardown] ${
            error instanceof Error ? error.message : String(error)
        }`
    )
    process.exit(1)
})
