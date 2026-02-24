import { db } from "@/drizzle"
import { describe, expect, test } from "bun:test"
import { graphqlRequest } from "../helpers"

describe("integration: GraphQL upsertUser", () => {
    test("inserts a new user when one does not exist", async () => {
        const upsertMutation = `
            mutation UpsertUser($input: UpsertUserInput!) {
                upsertUser(input: $input) {
                    id
                    username
                    discriminator
                    createdAt
                    updatedAt
                    deletedAt
                }
            }
        `

        const result = await graphqlRequest<{
            upsertUser: {
                id: string
                username: string
                discriminator: string
                createdAt: string
                updatedAt: string
                deletedAt: string | null
            }
        }>(upsertMutation, {
            input: {
                id: "it-upsert-user-1",
                username: "luke",
                discriminator: "0001",
            },
        })

        expect(result.errors).toBeUndefined()
        expect(result.data?.upsertUser).toMatchObject({
            id: "it-upsert-user-1",
            username: "luke",
            discriminator: "0001",
            deletedAt: null,
        })
        expect(result.data?.upsertUser.createdAt).toBeString()
        expect(result.data?.upsertUser.updatedAt).toBeString()

        const row = await db.query.users.findFirst({
            where: (user, { eq }) => eq(user.id, "it-upsert-user-1"),
        })

        expect(row).toBeDefined()
        expect(row).toMatchObject({
            id: "it-upsert-user-1",
            username: "luke",
            discriminator: "0001",
        })
    })

    test("updates an existing user when the id already exists", async () => {
        const upsertMutation = `
            mutation UpsertUser($input: UpsertUserInput!) {
                upsertUser(input: $input) {
                    id
                    username
                    discriminator
                    updatedAt
                }
            }
        `

        await graphqlRequest(upsertMutation, {
            input: {
                id: "it-upsert-user-2",
                username: "before",
                discriminator: "0001",
            },
        })

        const result = await graphqlRequest<{
            upsertUser: {
                id: string
                username: string
                discriminator: string
                updatedAt: string
            }
        }>(upsertMutation, {
            input: {
                id: "it-upsert-user-2",
                username: "after",
                discriminator: "0002",
            },
        })

        expect(result.errors).toBeUndefined()
        expect(result.data?.upsertUser).toMatchObject({
            id: "it-upsert-user-2",
            username: "after",
            discriminator: "0002",
        })
        expect(result.data?.upsertUser.updatedAt).toBeString()

        const row = await db.query.users.findFirst({
            where: (user, { eq }) => eq(user.id, "it-upsert-user-2"),
        })

        expect(row).toBeDefined()
        expect(row).toMatchObject({
            id: "it-upsert-user-2",
            username: "after",
            discriminator: "0002",
        })
    })
})
