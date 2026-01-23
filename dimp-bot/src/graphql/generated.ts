import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type CreateMessageInput = {
  channelId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
  discordCreatedAt: Scalars['DateTime']['input'];
  discordDeletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  discordUpdatedAt: Scalars['DateTime']['input'];
  guildId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type GenerateChatResponseInput = {
  channelId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
  guildId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type Message = {
  __typename?: 'Message';
  channelId: Scalars['ID']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  discordCreatedAt: Scalars['DateTime']['output'];
  discordDeletedAt?: Maybe<Scalars['DateTime']['output']>;
  discordUpdatedAt: Scalars['DateTime']['output'];
  guildId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createMessage: Message;
  generateChatResponse: Scalars['String']['output'];
  updateMessage?: Maybe<Message>;
};


export type MutationCreateMessageArgs = {
  input: CreateMessageInput;
};


export type MutationGenerateChatResponseArgs = {
  input: GenerateChatResponseInput;
};


export type MutationUpdateMessageArgs = {
  input: UpdateMessageInput;
};

export type Query = {
  __typename?: 'Query';
  message?: Maybe<Message>;
};


export type QueryMessageArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateMessageInput = {
  content: Scalars['String']['input'];
  discordDeletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  discordUpdatedAt: Scalars['DateTime']['input'];
  id: Scalars['ID']['input'];
};

export type CreateMessageMutationVariables = Exact<{
  channelId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
  discordCreatedAt: Scalars['DateTime']['input'];
  discordDeletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  guildId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: { __typename?: 'Message', id: string } };

export type GenerateChatResponseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  channelId: Scalars['ID']['input'];
  guildId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
}>;


export type GenerateChatResponseMutation = { __typename?: 'Mutation', generateChatResponse: string };


export const CreateMessageDocument = gql`
    mutation createMessage($channelId: ID!, $content: String!, $discordCreatedAt: DateTime!, $discordDeletedAt: DateTime, $guildId: ID!, $id: ID!, $userId: ID!) {
  createMessage(
    input: {channelId: $channelId, content: $content, discordCreatedAt: $discordCreatedAt, discordUpdatedAt: $discordCreatedAt, discordDeletedAt: $discordDeletedAt, guildId: $guildId, id: $id, userId: $userId}
  ) {
    id
  }
}
    `;
export const GenerateChatResponseDocument = gql`
    mutation generateChatResponse($id: ID!, $channelId: ID!, $guildId: ID!, $userId: ID!, $content: String!) {
  generateChatResponse(
    input: {id: $id, channelId: $channelId, guildId: $guildId, userId: $userId, content: $content}
  )
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    createMessage(variables: CreateMessageMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateMessageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateMessageMutation>({ document: CreateMessageDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'createMessage', 'mutation', variables);
    },
    generateChatResponse(variables: GenerateChatResponseMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GenerateChatResponseMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GenerateChatResponseMutation>({ document: GenerateChatResponseDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'generateChatResponse', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;