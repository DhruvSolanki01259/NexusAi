import { chatGroq } from "@/ai_components/models/groq-provider/groq";
import { RunnableConfig } from "@langchain/core/runnables";
import { ChatState } from "../states/chat.state";
import { tools } from "../tools/index";
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "langchain";

import { USER_CONVERSATION_PROMPT } from "@/ai_components/prompts/user.conversation.prompt";
import { chatSystemPrompt } from "@/ai_components/utils/createChatSystemPrompt";

const model = chatGroq;

const modelWithTools = model.bindTools(tools);

export const ChatNode = async (
  state: typeof ChatState.State,
  config: RunnableConfig,
) => {
  let query: string | null = null;

  const lastMessage = state.messages.at(-1);

  if (lastMessage instanceof HumanMessage) {
    query =
      typeof lastMessage.content === "string"
        ? lastMessage.content
        : String(lastMessage.content);
  }

  const SystemPrompt = await chatSystemPrompt(config);
  const HumanPrompt = USER_CONVERSATION_PROMPT;

  const { conversation_summary: summary } = state;

  const conversationHistory = state.messages.map((msg) => {
    let role = "UNKNOWN";

    if (msg instanceof AIMessage) role = "AI";
    else if (msg instanceof ToolMessage) role = "TOOL";
    else if (msg instanceof HumanMessage) role = "HUMAN";
    else if (msg instanceof SystemMessage) role = "SYSTEM";

    return `${role} - ${msg.content}`;
  });

  const formattedHumanPrompt = await HumanPrompt.format({
    userLatestConversationHistory: conversationHistory,
    userOldConversationSummary: summary ?? "",
  });

  const response = await modelWithTools.invoke([
    {
      role: "system",
      content: SystemPrompt ?? "",
    },
    {
      role: "human",
      content: formattedHumanPrompt,
    },
  ]);

  return {
    messages: [response],
    userQuery: query,
  };
};
