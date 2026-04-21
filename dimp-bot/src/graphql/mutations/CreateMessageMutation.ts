import gql from "graphql-tag"

export const CreateMessageMutation = gql`
    mutation createMessage(
        $channelId: ID!
        $content: String!
        $discordCreatedAt: DateTime!
        $discordDeletedAt: DateTime
        $guildId: ID!
        $guildName: String!
        $id: ID!
        $userId: ID!
    ) {
        createMessage(
            input: {
                channelId: $channelId
                content: $content
                discordCreatedAt: $discordCreatedAt
                discordUpdatedAt: $discordCreatedAt
                discordDeletedAt: $discordDeletedAt
                guildId: $guildId
                guildName: $guildName
                id: $id
                userId: $userId
            }
        ) {
            id
        }
    }
`
