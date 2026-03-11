type ClientReadyDependencies = {
    getCommandCount: () => number
    logger: {
        info: (message: string) => void
    }
}

type ReadyClient = {
    user?: {
        tag?: string
    }
}

export const createClientReadyHandler =
    ({ getCommandCount, logger }: ClientReadyDependencies) =>
    (client: ReadyClient) => {
        logger.info(`Logged in as ${client.user?.tag}`)
        logger.info(`${getCommandCount()} commands loaded.`)
    }
