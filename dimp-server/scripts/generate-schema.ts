import fs from "fs"
import { printSchema } from "graphql"
import path from "path"

const ensureSchemaGenerationEnv = () => {
    // Schema generation imports modules that share the runtime env parser, but
    // it does not need live Discord or database configuration.
    process.env.DISCORD_CLIENT_ID ??= "0"
    process.env.DATABASE_URL ??=
        "postgres://postgres:postgres@127.0.0.1:5432/dimp"
}

ensureSchemaGenerationEnv()

const { schema } = await import("@graphql")

const sdl = printSchema(schema)

const outputPath = path.resolve(process.cwd(), "schema.graphql")
fs.writeFileSync(outputPath, sdl)

console.log(`GraphQL schema generated at ${outputPath}`)
