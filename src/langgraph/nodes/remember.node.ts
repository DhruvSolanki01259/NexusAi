import { RunnableConfig } from "@langchain/core/runnables";

import { REMEMBER_MEMORY_SYSTEM_PROMPT } from "@/ai_components/prompts/remember.memory.prompt";
import { rememberGroq } from "@/ai_components/models/groq-provider/groq";
import { RememberSchema } from "@/ai_components/types/remember.memory.type";

import { ChatState } from "../states/chat.state";
import { store } from "../persistence/postgres";
import { shouldAnalyzeMemory } from "@/ai_components/utils/shouldAnalyzeMemory";

const structuredModel = rememberGroq.withStructuredOutput(RememberSchema);

export const RememberNode = async (
  state: typeof ChatState.State,
  config: RunnableConfig,
) => {
  try {
    // Get the latest user query
    const query = state.userQuery?.trim();

    if (!query) {
      console.log("[REMEMBER] No user query available. Skipping.");
      return;
    }
    // Skip the memory LLM when the message is obviously
    if (!shouldAnalyzeMemory(query)) {
      console.log("[REMEMBER] No memory-related signal. Skipping.");
      return;
    }

    // Get user ID
    const metadata = config?.metadata;

    const userId =
      typeof metadata?.userId === "string" ? metadata.userId.trim() : "";
    if (!userId) {
      console.warn("[REMEMBER] User ID is missing. Skipping memory.");
      return;
    }

    const namespace = ["users", userId];
    const storedMemory = await store.search(namespace, {
      limit: 50,
    });

    const formattedMemory = storedMemory
      .map((memory, index) => {
        const memoryValue = memory.value as
          | {
              memoryId?: string;
              category?: string;
              value?: string;
            }
          | undefined;

        const category = memoryValue?.category ?? "others";
        const value = memoryValue?.value ?? "";
        const memoryId = memoryValue?.memoryId ?? memory.key;

        return `${index + 1}. [${category}] ${value} (memoryId: ${memoryId})`;
      })
      .join("\n");

    const formattedPrompt = await REMEMBER_MEMORY_SYSTEM_PROMPT.format({
      existing_memory: formattedMemory || "No existing memories.",
      user_message: query,
    });
    const response = await structuredModel.invoke(formattedPrompt);
    console.log("[REMEMBER] Model response:", response);

    if (!response?.memories?.length) {
      console.log("[REMEMBER] No memory changes required.");
      return;
    }

    for (const memory of response.memories) {
      const { operation, memoryId, category, value } = memory;

      // CREATE
      if (operation === "create") {
        if (!value?.trim()) {
          console.warn("[REMEMBER] Skipping create: memory value is empty.");
          continue;
        }

        const newMemoryId = crypto.randomUUID();

        await store.put(namespace, newMemoryId, {
          memoryId: newMemoryId,
          category: category ?? "others",
          value: value.trim(),
        });

        console.log("[REMEMBER] Memory created:", {
          memoryId: newMemoryId,
          category: category ?? "others",
          value: value.trim(),
        });

        continue;
      }

      // UPDATE
      if (operation === "update") {
        if (!memoryId) {
          console.warn("[REMEMBER] Skipping update: memoryId is missing.");
          continue;
        }

        if (!value?.trim()) {
          console.warn("[REMEMBER] Skipping update: memory value is empty.");
          continue;
        }

        await store.put(namespace, memoryId, {
          memoryId,
          category: category ?? "others",
          value: value.trim(),
        });

        console.log("[REMEMBER] Memory updated:", {
          memoryId,
          category: category ?? "others",
          value: value.trim(),
        });

        continue;
      }

      // DELETE
      if (operation === "delete") {
        if (!memoryId) {
          console.warn("[REMEMBER] Skipping delete: memoryId is missing.");
          continue;
        }

        await store.delete(namespace, memoryId);

        console.log("[REMEMBER] Memory deleted:", {
          memoryId,
          category: category ?? "others",
        });

        continue;
      }

      // NONE
      if (operation === "none") {
        console.log("[REMEMBER] No memory operation required.");
        continue;
      }

      // UNKNOWN OPERATION
      console.warn(
        `[REMEMBER] Unknown memory operation received: ${operation}`,
      );
    }
  } catch (error) {
    console.error(
      "[REMEMBER] Memory processing failed. Continuing chat.",
      error,
    );

    return;
  }
};
