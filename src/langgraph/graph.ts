import { END, START, StateGraph } from "@langchain/langgraph";
import { ChatState } from "./states/chat.state";
import { ChatNode } from "./nodes/chat.node";
import { SummarizeNode } from "./nodes/summarize.node";
import { tools } from "./tools/index";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "langchain";

const graphRouter = async (state: typeof ChatState.State) => {
  const lastMessage = state.messages[state.messages.length - 1];
  if (
    lastMessage instanceof AIMessage &&
    lastMessage.tool_calls &&
    lastMessage.tool_calls.length > 0
  ) {
    console.log(`Routing to [TOOLS]`);
    return "tools";
  }

  if (state.messages.length > 20) {
    console.log(`Routing to [SUMMARIZE]`);
    return "summarize";
  }

  console.log(`Routing to [END]`);
  return "end";
};

export const graph = new StateGraph(ChatState)
  // Nodes
  .addNode("chat_node", ChatNode)
  .addNode("summarize_node", SummarizeNode)
  .addNode("tool_node", new ToolNode(tools))

  // Edges
  .addEdge(START, "chat_node")
  .addEdge("summarize_node", END)
  .addEdge("tool_node", "chat_node")

  // Conditional Edges
  .addConditionalEdges("chat_node", graphRouter, {
    summarize: "summarize_node",
    tools: "tool_node",
    end: END,
  });
