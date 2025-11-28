import { ChatOpenAI } from "@langchain/openai"

export const gpt_5_mini = new ChatOpenAI({
    model: "gpt-5-mini",
})
