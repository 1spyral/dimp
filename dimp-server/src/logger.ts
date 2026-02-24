import { env } from "@/env"
import pino from "pino"

// Shared pino config for the server runtime
export const loggerConfig = {
    level: env.LOG_LEVEL,
    transport:
        env.NODE_ENV === "development"
            ? {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                      translateTime: "SYS:standard",
                      ignore: "pid,hostname",
                  },
              }
            : undefined,
}

export const logger = pino(loggerConfig)
