import { userSelectSchema } from "@schema"
import { z } from "zod"

export type User = z.infer<typeof userSelectSchema>
