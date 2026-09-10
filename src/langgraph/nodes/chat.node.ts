import { chatGroq } from "@/ai_components/models/groq-provider/groq";
import { chatSystemPrompt } from "@/ai_components/utils/createChatSystemPrompt";
import { USER_CONVERSATION_PROMPT } from "@/ai_components/prompts/user.conversation.prompt";

import { RunnableConfig } from "@langchain/core/runnables";
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "langchain";

import { ChatState } from "../states/chat.state";
import { tools } from "../tools";

const modelWithTools = chatGroq.bindTools(tools);

export const ChatNode = async (
  state: typeof ChatState.State,
  config: RunnableConfig,
) => {
  // Get the latest message
  const lastMessage = state.messages.at(-1);

  let userQuery: string | undefined;

  if (lastMessage instanceof HumanMessage) {
    userQuery =
      typeof lastMessage.content === "string"
        ? lastMessage.content
        : String(lastMessage.content);
  }

  // Build the dynamic system prompt
  const systemPrompt = await chatSystemPrompt(config);

  // Build conversation history
  const conversationHistory = state.messages.map((message) => {
    let role = "UNKNOWN";

    if (message instanceof HumanMessage) {
      role = "HUMAN";
    } else if (message instanceof AIMessage) {
      role = "AI";
    } else if (message instanceof ToolMessage) {
      role = "TOOL";
    } else if (message instanceof SystemMessage) {
      role = "SYSTEM";
    }

    const content =
      typeof message.content === "string"
        ? message.content
        : JSON.stringify(message.content);

    return `${role} - ${content}`;
  });

  // Format the conversation prompt
  const formattedHumanPrompt = await USER_CONVERSATION_PROMPT.format({
    userLatestConversationHistory: conversationHistory,
    userOldConversationSummary: state.conversation_summary ?? "",
  });

  // Invoke the model
  const response = await modelWithTools.invoke([
    {
      role: "system",
      content: systemPrompt ?? "",
    },
    {
      role: "human",
      content: formattedHumanPrompt,
    },
  ]);

  // Return state updates
  if (userQuery !== undefined) {
    return {
      messages: [response],
      userQuery,
    };
  }

  return {
    messages: [response],
  };
};
