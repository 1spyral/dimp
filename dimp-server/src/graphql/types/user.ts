import type { User } from "@/types"
import { builder } from "../builder"

export const UserRef = builder.objectRef<User>("User")

UserRef.implement({
    fields: t => ({
        id: t.exposeID("id", { nullable: false }),
        username: t.exposeString("username", { nullable: false }),
        discriminator: t.exposeString("discriminator", { nullable: false }),
        createdAt: t.expose("createdAt", { type: "DateTime", nullable: false }),
        updatedAt: t.expose("updatedAt", { type: "DateTime", nullable: false }),
        deletedAt: t.expose("deletedAt", { type: "DateTime", nullable: true }),
    }),
})
