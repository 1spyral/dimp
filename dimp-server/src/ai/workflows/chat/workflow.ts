import { END, START, StateGraph } from "@langchain/langgraph"
import { ChatState, respondChat } from "."

export const workflow = new StateGraph(ChatState)
    .addNode("respondChat", respondChat)
    .addEdge(START, "respondChat")
    .addEdge("respondChat", END)
    .compile()
