import { messageSelectSchema } from "@schema"
import { z } from "zod"

export type Message = z.infer<typeof messageSelectSchema>
