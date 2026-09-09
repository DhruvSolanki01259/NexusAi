import { SHORT_TERM_MEMORY_PROMPT } from "@/ai_components/prompts/short.term.memory.prompt";
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "langchain";
import { RemoveMessage } from "@langchain/core/messages";
import { ChatState } from "../states/chat.state";
import { summarizeGroq } from "@/ai_components/models/groq-provider/groq";

const model = summarizeGroq;

const MAX_MESSAGES_LIMIT = 10;
const KEEP_LATEST_MESSAGES = 4;

const getPrompt = async (state: typeof ChatState.State) => {
  const messagesToTrim = state.messages.slice(0, -KEEP_LATEST_MESSAGES);
  const conversationHistory = messagesToTrim.map((msg) => {
    let role = null;

    if (msg instanceof HumanMessage) role = "HUMAN";
    else if (msg instanceof AIMessage) role = "AI";
    else if (msg instanceof SystemMessage) role = "SYSTEM";
    else if (msg instanceof ToolMessage) role = "TOOl";

    return `${role} - ${msg.content}`;
  });

  const isSummaryPresent = state.conversation_summary ? true : false;
  const systemPrompt = SHORT_TERM_MEMORY_PROMPT(isSummaryPresent);

  const formattedPrompt = systemPrompt.format({
    conversation: conversationHistory,
    summary: state.conversation_summary,
  });

  return formattedPrompt;
};

export const SummarizeNode = async (state: typeof ChatState.State) => {
  if (state.messages.length <= MAX_MESSAGES_LIMIT) return {};

  const prompt = await getPrompt(state);
  const response = await model.invoke(prompt);

  const updatedSummary =
    response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  const messagesToTrim = state.messages.slice(0, -KEEP_LATEST_MESSAGES);
  const deletedMessages = messagesToTrim.map(
    (msg) => new RemoveMessage({ id: msg.id! }),
  );

  return { messages: deletedMessages, conversation_summary: updatedSummary };
};
