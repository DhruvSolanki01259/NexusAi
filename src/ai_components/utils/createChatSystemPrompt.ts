import { store } from "@/langgraph/workflow";
import { LONG_TERM_MEMORY_PROMPT } from "../prompts/long.term.memory.prompt";
import { RunnableConfig } from "@langchain/core/runnables";

interface Personalization {
  enabled: boolean;
  nickname: string;
  profession: string;
  interests: string;
  responseStyle: string;
  responseLength: string;
  technicalLevel: string;
  emojis: boolean;
  structuredResponses: boolean;
  instructions: string;
}

export const chatSystemPrompt = async (config: RunnableConfig) => {
  const userId = config?.metadata?.userId;
  if (!userId) return "";

  const personalization = config?.metadata?.personalization as
    | Partial<Personalization>
    | undefined;

  const {
    enabled = false,
    nickname = "",
    profession = "",
    interests = "",
    responseStyle = "",
    responseLength = "",
    technicalLevel = "",
    emojis = false,
    structuredResponses = false,
    instructions = "",
  } = personalization ?? {};

  const namespace: string[] = ["users", String(userId)];

  const storedMemory = await store.search(namespace, {
    limit: 1000,
  });

  const formattedMemory = storedMemory
    .map(
      (memory, index) =>
        `${index + 1}. [${memory.key}] ${
          memory.value?.value ?? ""
        } (memoryId: ${memory.value?.memoryId ?? ""})`,
    )
    .join("\n");

  const prompt = LONG_TERM_MEMORY_PROMPT({
    enabled,
    nickname,
    profession,
    interests,
    responseStyle,
    responseLength,
    technicalLevel,
    emojis,
    structuredResponses,
    instructions,
    user_ltm_memory: formattedMemory,
  });

  return prompt;
};
