import { agent } from "./chat"
import type { ChatStateType } from "./chat"

export const chatAgent = {
    invoke: (state: ChatStateType): Promise<ChatStateType> =>
        agent.invoke(state) as Promise<ChatStateType>,
}
