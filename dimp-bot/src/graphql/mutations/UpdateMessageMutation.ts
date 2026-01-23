import gql from "graphql-tag"

export const UpdateMessageMutation = gql`
    mutation updateMessage(
        $id: ID!
        $content: String!
        $discordUpdatedAt: DateTime!
        $discordDeletedAt: DateTime
    ) {
        updateMessage(
            input: {
                id: $id
                content: $content
                discordUpdatedAt: $discordUpdatedAt
                discordDeletedAt: $discordDeletedAt
            }
        ) {
            id
        }
    }
`
