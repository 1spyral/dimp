import { GraphQLClient } from "graphql-request"
import { getSdk } from "./generated"
import { env } from "@/env"

const graphqlClient = new GraphQLClient(env.GRAPHQL_API_URL, {})

export const api = getSdk(graphqlClient)
