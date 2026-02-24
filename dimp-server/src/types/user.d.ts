import { userSelectSchema } from "@schema"
import { type Static } from "@sinclair/typebox"

export type User = Static<typeof userSelectSchema>
