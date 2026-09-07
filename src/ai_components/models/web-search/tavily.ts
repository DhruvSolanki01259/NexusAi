import { loadEnv } from "@/ai_components/utils/loadEnv";
import { tavily } from "@tavily/core";

export const tavilyClient = tavily({
  apiKey: loadEnv.TavilyApiKey,
});
