import { messageSelectSchema } from "@schema"
import { type Static } from "@sinclair/typebox"

export type Message = Static<typeof messageSelectSchema>
