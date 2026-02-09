import { env } from "@/env"
import { GraphQLClient } from "graphql-request"
import { getSdk } from "./generated"

const graphqlClient = new GraphQLClient(env.GRAPHQL_API_URL, {})

export const api = getSdk(graphqlClient)
