import gql from "graphql-tag"

export const UpsertUserMutation = gql`
    mutation upsertUser($id: ID!, $username: String!, $discriminator: String!) {
        upsertUser(
            input: {
                id: $id
                username: $username
                discriminator: $discriminator
            }
        ) {
            id
        }
    }
`
