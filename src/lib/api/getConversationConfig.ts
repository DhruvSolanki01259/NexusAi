import { RunnableConfig } from "@langchain/core/runnables";
import { StreamMode } from "@langchain/langgraph";

export interface Personalization {
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

export const getConversationConfig = (
  conversationId: string,
  userId: string,
  personalization: Personalization,
): RunnableConfig => {
  return {
    configurable: { thread_id: conversationId },
    streamMode: ["updates", "messages"] as StreamMode[],
    metadata: {
      userId,
      personalization,
    },
  };
};
