import { loadEnv } from "@/ai_components/utils/loadEnv";
import { ChatGroq } from "@langchain/groq";

if (
  !loadEnv.ChatGroqApiKey ||
  !loadEnv.TitleGroqApiKey ||
  !loadEnv.SummarizeGroqApiKey ||
  !loadEnv.RememberGroqApiKey
) {
  throw new Error("[GROQ CONFIG ERROR]: GROQ_API_KEY is missing.");
}

if (
  !loadEnv.ChatGroqModel ||
  !loadEnv.TitleGroqModel ||
  !loadEnv.SummarizeGroqModel ||
  !loadEnv.RememberGroqModel
) {
  throw new Error("[GROQ MODEL ERROR]: GROQ_MODEL is missing.");
}

export const chatGroq = new ChatGroq({
  apiKey: loadEnv.ChatGroqApiKey!,
  model: loadEnv.ChatGroqModel!,
  temperature: 0.3,
});

export const titleGroq = new ChatGroq({
  apiKey: loadEnv.TitleGroqApiKey!,
  model: loadEnv.TitleGroqModel!,
  temperature: 0.3,
});

export const summarizeGroq = new ChatGroq({
  apiKey: loadEnv.SummarizeGroqApiKey!,
  model: loadEnv.SummarizeGroqModel!,
  temperature: 0.3,
});

export const rememberGroq = new ChatGroq({
  apiKey: loadEnv.RememberGroqApiKey!,
  model: loadEnv.RememberGroqModel!,
  temperature: 0.3,
});
