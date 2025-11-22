import { schema } from "@graphql"
import { printSchema } from "graphql"
import path from "path"
import fs from "fs"

const sdl = printSchema(schema)

const outputPath = path.resolve(process.cwd(), "schema.graphql")
fs.writeFileSync(outputPath, sdl)

console.log(`GraphQL schema generated at ${outputPath}`)
