import { loadEnv } from "@/ai_components/utils/loadEnv";
import { ChatGroq } from "@langchain/groq";

export const groq = new ChatGroq({
  apiKey: loadEnv.GroqApiKey!,
  model: loadEnv.GroqModel!,
  temperature: 0.3,
});
