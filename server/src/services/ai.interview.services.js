import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import puppeteer from "puppeteer";
const getModel = () => {
  return new ChatOpenAI({
    model: process.env.AI_MODEL || "openai/gpt-oss-120b",
    apiKey: process.env.OPENROUTER_API_KEY,
    temperature: 0.2,
    configuration: {
      baseURL: process.env.OPENROUTER_BASE_URL,
    },
  });
};

export const askAI = async (messages) => {
    try {
        if(!messages || !Array.isArray(messages) || messages.length === 0){
            throw new Error("Messages array is empty or invalid.")
        }

        const model = getModel()
        const response = await model.invoke(messages);
        if (!response || !response.content) {
            throw new Error("No response from AI");
        }
        return response.content;
    } catch (error) {
        if (error.response?.status === 429) {
            throw new Error("Too many requests. Please try again later. Quota might be full.");
        }
        console.error("AI Service Error:", error.response?.data || error.message || error);
        throw new Error("Failed to process request with AI service. Please try again later.");
    }
}