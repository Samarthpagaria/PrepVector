import { ChatOpenAI } from "@langchain/openai";

const ai_model = new ChatOpenAI({
  model: process.env.AI_MODEL,
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: process.env.OPENROUTER_BASE_URL,
  },
});

export default ai_model;
