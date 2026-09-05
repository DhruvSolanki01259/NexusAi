import { StreamMode } from "@langchain/langgraph";

export const getConversationConfig = (id: string) => {
  return {
    configurable: { thread_id: id },
    streamMode: ["updates", "messages"] as StreamMode[],
  };
};
