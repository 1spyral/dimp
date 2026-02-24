import type { ContextLogger } from "@/graphql/context"
import { mock } from "bun:test"

export const createMockContextLogger = () => {
    const logger = {
        error: mock(() => {}),
        warn: mock(() => {}),
        info: mock(() => {}),
        debug: mock(() => {}),
        child: mock(() => logger),
    } satisfies ContextLogger

    return logger
}
