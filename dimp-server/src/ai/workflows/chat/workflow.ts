import { END, START, StateGraph } from "@langchain/langgraph"
import { respondChat } from "./nodes"
import { ChatState } from "./state"

export const workflow = new StateGraph(ChatState)
    .addNode("respondChat", respondChat)
    .addEdge(START, "respondChat")
    .addEdge("respondChat", END)
    .compile()
