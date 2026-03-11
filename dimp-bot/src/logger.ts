import { env } from "@/env"
import pino from "pino"

const MAX_LOG_DEPTH = 4
const MAX_LOG_ENTRIES = 25

const getObjectType = (value: object) => value.constructor?.name ?? "Object"

const serializeValueForLogging = (
    value: unknown,
    seen: WeakSet<object>,
    depth: number
): unknown => {
    if (
        value === null ||
        value === undefined ||
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return value
    }

    if (typeof value === "bigint" || typeof value === "symbol") {
        return String(value)
    }

    if (typeof value === "function") {
        return `[Function ${value.name || "anonymous"}]`
    }

    if (value instanceof Error) {
        return serializeErrorForLogging(value, seen, depth)
    }

    if (Array.isArray(value)) {
        if (depth >= MAX_LOG_DEPTH) {
            return `[Array(${value.length})]`
        }

        return value
            .slice(0, MAX_LOG_ENTRIES)
            .map(item => serializeValueForLogging(item, seen, depth + 1))
    }

    if (typeof value === "object") {
        if (seen.has(value)) {
            return "[Circular]"
        }

        seen.add(value)

        if (depth >= MAX_LOG_DEPTH) {
            return `[${getObjectType(value)}]`
        }

        return Object.fromEntries(
            Object.entries(value)
                .slice(0, MAX_LOG_ENTRIES)
                .map(([key, entryValue]) => [
                    key,
                    serializeValueForLogging(entryValue, seen, depth + 1),
                ])
        )
    }

    return String(value)
}

const getObjectProperty = (value: object, key: string): unknown => {
    try {
        return Reflect.get(value, key)
    } catch {
        return undefined
    }
}

const serializeErrorLikeObjectForLogging = (
    error: object,
    seen: WeakSet<object>,
    depth: number
): Record<string, unknown> | undefined => {
    const name = getObjectProperty(error, "name")
    const message = getObjectProperty(error, "message")
    const stack = getObjectProperty(error, "stack")
    const cause = getObjectProperty(error, "cause")

    if (
        typeof name !== "string" &&
        typeof message !== "string" &&
        typeof stack !== "string" &&
        cause === undefined
    ) {
        return undefined
    }

    if (seen.has(error)) {
        return {
            type:
                typeof name === "string" && name.length > 0
                    ? name
                    : getObjectType(error),
            message: typeof message === "string" ? message : undefined,
            circular: true,
        }
    }

    seen.add(error)

    const details = Object.fromEntries(
        Object.entries(error)
            .filter(
                ([key]) => !["name", "message", "stack", "cause"].includes(key)
            )
            .slice(0, MAX_LOG_ENTRIES)
            .map(([key, value]) => [
                key,
                serializeValueForLogging(value, seen, depth + 1),
            ])
    )

    return {
        type:
            typeof name === "string" && name.length > 0
                ? name
                : getObjectType(error),
        message: typeof message === "string" ? message : undefined,
        stack: typeof stack === "string" ? stack : undefined,
        cause:
            cause !== undefined
                ? serializeValueForLogging(cause, seen, depth + 1)
                : undefined,
        details: Object.keys(details).length > 0 ? details : undefined,
    }
}

export const serializeErrorForLogging = (
    error: unknown,
    seen: WeakSet<object> = new WeakSet(),
    depth = 0
): Record<string, unknown> => {
    if (error instanceof Error) {
        if (seen.has(error)) {
            return {
                type: error.name || getObjectType(error),
                message: error.message,
                circular: true,
            }
        }

        seen.add(error)

        const details = Object.fromEntries(
            Object.entries(error as Record<string, unknown>)
                .filter(
                    ([key]) =>
                        !["name", "message", "stack", "cause"].includes(key)
                )
                .slice(0, MAX_LOG_ENTRIES)
                .map(([key, value]) => [
                    key,
                    serializeValueForLogging(value, seen, depth + 1),
                ])
        )

        return {
            type: error.name || getObjectType(error),
            message: error.message,
            stack: error.stack,
            cause:
                "cause" in error
                    ? serializeValueForLogging(
                          (error as Error & { cause?: unknown }).cause,
                          seen,
                          depth + 1
                      )
                    : undefined,
            details: Object.keys(details).length > 0 ? details : undefined,
        }
    }

    if (typeof error === "string") {
        return {
            type: "string",
            message: error,
        }
    }

    if (typeof error === "object" && error !== null) {
        const serializedErrorLikeObject = serializeErrorLikeObjectForLogging(
            error,
            seen,
            depth
        )

        if (serializedErrorLikeObject) {
            return serializedErrorLikeObject
        }
    }

    return {
        type: typeof error,
        value: serializeValueForLogging(error, seen, depth + 1),
    }
}

type LoggerConfigInput = Pick<typeof env, "LOG_LEVEL" | "NODE_ENV">

export const createLoggerConfig = (input: LoggerConfigInput) => ({
    level: input.LOG_LEVEL,
    transport:
        input.NODE_ENV === "development"
            ? {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                      translateTime: "SYS:standard",
                      ignore: "pid,hostname",
                  },
              }
            : undefined,
})

export const loggerConfig = createLoggerConfig(env)

export const logger = pino(loggerConfig)
