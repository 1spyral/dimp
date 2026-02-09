import { schema } from "@graphql"
import fs from "fs"
import { printSchema } from "graphql"
import path from "path"

const sdl = printSchema(schema)

const outputPath = path.resolve(process.cwd(), "schema.graphql")
fs.writeFileSync(outputPath, sdl)

console.log(`GraphQL schema generated at ${outputPath}`)
