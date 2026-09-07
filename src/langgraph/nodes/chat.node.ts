import { groq } from "@/ai_components/models";
import { ChatState } from "../states/chat.state";
import { tools } from "../tools/index";

const model = groq;
const modelWithTools = model.bindTools(tools);

export const ChatNode = async (state: typeof ChatState.State) => {
  const response = await modelWithTools.invoke(state.messages);
  return { messages: [response] };
};
