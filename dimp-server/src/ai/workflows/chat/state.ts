import { Annotation } from "@langchain/langgraph"
import { Type, type Static } from "@sinclair/typebox"

const ChatMessageSchema = Type.Object({
    content: Type.Union([Type.String(), Type.Null()]),
    user: Type.Optional(Type.String()),
})

export const ChatStateSchema = Type.Object({
    history: Type.Array(ChatMessageSchema),
    message: ChatMessageSchema,
    response: Type.Optional(Type.String()),
})

export type ChatStateType = Static<typeof ChatStateSchema>

export const ChatState = Annotation.Root({
    history: Annotation<ChatStateType["history"]>(),
    message: Annotation<ChatStateType["message"]>(),
    response: Annotation<ChatStateType["response"]>(),
})
