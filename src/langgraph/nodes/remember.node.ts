import { RunnableConfig } from "@langchain/core/runnables";

import { REMEMBER_MEMORY_SYSTEM_PROMPT } from "@/ai_components/prompts/remember.memory.prompt";
import { rememberGroq } from "@/ai_components/models/groq-provider/groq";

import { ChatState } from "../states/chat.state";
import { store } from "../workflow";
import { RememberSchema } from "@/ai_components/types/remember.memory.type";

const model = rememberGroq;

const structuredModel = model.withStructuredOutput(RememberSchema);

const prompt = REMEMBER_MEMORY_SYSTEM_PROMPT;

export const RememberNode = async (
  state: typeof ChatState.State,
  config: RunnableConfig,
) => {
  const { userQuery: query } = state;

  const metadata = config?.metadata;
  const userId = String(metadata?.userId);

  if (!userId || userId === "undefined") {
    throw new Error("User ID is missing from workflow metadata");
  }

  const namespace = ["users", userId];

  // Get existing memories
  const storedMemory = await store.search(namespace, {
    limit: 1000,
  });

  // Format memories for the LLM
  const formattedMemory = storedMemory
    .map(
      (memory, index) =>
        `${index + 1}. [${memory.key}] ${
          memory.value?.value ?? ""
        } (memoryId: ${memory.value?.memoryId ?? ""})`,
    )
    .join("\n");

  // Create prompt
  const formattedPrompt = await prompt.format({
    existing_memory: formattedMemory || "No existing memories.",
    user_message: query,
  });

  // Ask LLM for memory operations
  const response = await structuredModel.invoke(formattedPrompt);
  console.log("Remember response:", response);

  // Execute memory operations
  if (response.memories === undefined) {
    return;
  }

  for (const memory of response.memories) {
    const { operation, memoryId, category, value } = memory;

    // CREATE
    if (operation === "create") {
      const newMemoryId = crypto.randomUUID();

      await store.put(namespace, newMemoryId, {
        memoryId: newMemoryId,
        value,
      });

      console.log("Memory created:", {
        memoryId: newMemoryId,
        category,
        value,
      });

      continue;
    }

    // UPDATE
    if (operation === "update") {
      if (!memoryId) {
        console.warn("Skipping update: memoryId is missing");
        continue;
      }

      await store.put(namespace, memoryId, {
        memoryId,
        value,
      });

      console.log("Memory updated:", {
        memoryId,
        category,
        value,
      });

      continue;
    }

    // DELETE
    if (operation === "delete") {
      if (!memoryId) {
        console.warn("Skipping delete: memoryId is missing");
        continue;
      }

      await store.delete(namespace, memoryId);

      console.log("Memory deleted:", {
        memoryId,
        category,
      });

      continue;
    }
  }

  // Return result
  return {
    memories: response.memories,
  };
};
