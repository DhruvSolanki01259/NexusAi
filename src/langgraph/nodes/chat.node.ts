import { groq } from "@/ai_components/models";
import { ChatState } from "../states/chat.state";

const model = groq;

export const ChatNode = async (state: typeof ChatState.State) => {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
};
