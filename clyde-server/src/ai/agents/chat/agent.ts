import { END, START, StateGraph } from "@langchain/langgraph"
import { ChatState, respondChat } from "."

const workflow = new StateGraph(ChatState)
    .addNode("respondChat", respondChat)
    .addEdge(START, "respondChat")
    .addEdge("respondChat", END)

export const agent = workflow.compile()
