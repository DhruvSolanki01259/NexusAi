import { AIMessage, HumanMessage } from "langchain";
import { ChatState } from "../states/chat.state";
import { z } from "zod";
import { groq } from "@/ai_components/models/index";

const TitleSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(60)
    .describe("A concise conversation title, ideally 3 to 6 words."),
});

const titleModel = groq;

const structuredTitleModel = titleModel.withStructuredOutput(TitleSchema);

export const TitleNode = async (state: typeof ChatState.State) => {
  const firstUserMessage = state.messages.find(
    (message) => message instanceof HumanMessage,
  );

  if (!firstUserMessage) {
    return {};
  }

  const content =
    typeof firstUserMessage.content === "string"
      ? firstUserMessage.content
      : JSON.stringify(firstUserMessage.content);

  const result = await structuredTitleModel.invoke([
    new AIMessage({
      content: `
        Generate a concise title for the conversation based on the user's first message.

        Rules:
        - 3 to 6 words preferred
        - Maximum 60 characters
        - Describe the user's main intent
        - Do not use quotes
        - Do not use prefixes like "Chat about", "Discussion about", or "Question about"
        - Do not include emojis
        - Do not answer the user's question
        - Return only the title
      `,
    }),
    new HumanMessage({
      content,
    }),
  ]);

  return {
    title: result.title.trim(),
  };
};
