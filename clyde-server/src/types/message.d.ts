import { z } from "zod"
import { messageSelectSchema } from "@schema"

export type Message = z.infer<typeof messageSelectSchema>
