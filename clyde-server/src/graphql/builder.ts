import SchemaBuilder from "@pothos/core"
import { DateResolver, JSONResolver } from "graphql-scalars"
import { Context } from "."

export const builder = new SchemaBuilder<{
    Context: Context
    Scalars: {
        JSON: {
            Input: unknown
            Output: unknown
        }
        Date: {
            Input: Date
            Output: Date
        }
    }
}>({})

builder.addScalarType("Date", DateResolver, {})
builder.addScalarType("JSON", JSONResolver, {})

builder.queryType({})
// builder.mutationType({})
