import { spawn } from "node:child_process"
import { createServer } from "node:net"

const run = (
    command: string,
    args: string[],
    envOverrides?: Record<string, string>
) =>
    new Promise<void>((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: "inherit",
            env: { ...process.env, ...envOverrides },
        })

        child.on("error", reject)
        child.on("exit", code => {
            if (code === 0) {
                resolve()
                return
            }

            reject(
                new Error(
                    `Command failed (${code ?? "unknown"}): ${command} ${args.join(" ")}`
                )
            )
        })
    })

const getFreePort = () =>
    new Promise<number>((resolve, reject) => {
        const server = createServer()

        server.on("error", reject)
        server.listen(0, "127.0.0.1", () => {
            const address = server.address()

            if (!address || typeof address === "string") {
                server.close(() =>
                    reject(new Error("Failed to determine a free TCP port"))
                )
                return
            }

            const { port } = address

            server.close(error => {
                if (error) {
                    reject(error)
                    return
                }

                resolve(port)
            })
        })
    })

const main = async () => {
    let startedDb = false
    const port = await getFreePort()
    const childEnv = {
        DIMP_SERVER_TEST_PG_PORT: String(port),
        DATABASE_URL: `postgres://postgres:postgres@127.0.0.1:${port}/dimp_test`,
    }

    try {
        await run("bun", ["run", "test:integration:db:up"], childEnv)
        startedDb = true

        await run("bun", ["run", "test:integration:db:migrate"], childEnv)
        await run("bun", ["run", "test:integration"], childEnv)
    } finally {
        if (startedDb) {
            try {
                await run("bun", ["run", "test:integration:db:down"], childEnv)
            } catch (error) {
                console.error(
                    "Failed to tear down integration test database",
                    error
                )
                process.exitCode = 1
            }
        }
    }
}

await main()
