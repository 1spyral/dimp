import gql from "graphql-tag"

export const CreateMessageMutation = gql`
    mutation createMessage(
        $id: ID!
        $userId: ID!
        $channelId: ID!
        $guildId: ID!
        $content: String!
        $discordCreatedAt: DateTime!
        $discordUpdatedAt: DateTime!
    ) {
        createMessage(
            id: $id
            userId: $userId
            channelId: $channelId
            guildId: $guildId
            content: $content
            discordCreatedAt: $discordCreatedAt
            discordUpdatedAt: $discordUpdatedAt
        ) {
            id
        }
    }
`
