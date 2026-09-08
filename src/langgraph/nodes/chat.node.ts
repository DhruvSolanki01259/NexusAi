import { RunnableConfig } from "@langchain/core/runnables";
import { ChatState } from "../states/chat.state";
import { groq } from "@/ai_components/models";
import { tools } from "../tools/index";
import { store } from "../workflow";

interface MetadataProps {
  userId: string | undefined;
}

const model = groq;
const modelWithTools = model.bindTools(tools);

export const ChatNode = async (
  state: typeof ChatState.State,
  config: RunnableConfig,
) => {
  // const metadata = config?.metadata;
  // const { userId }: MetadataProps = metadata;

  // const namespace: string[] = ["users", String(userId)];

  // const ltmStore = store;
  // await ltmStore.put(namespace, "profile", { name: "Dhruv" });

  const response = await modelWithTools.invoke(state.messages);
  return { messages: [response] };
};
