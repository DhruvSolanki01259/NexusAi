import { END, START, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "langchain";

import { ChatState } from "./states/chat.state";
import { ChatNode } from "./nodes/chat.node";
import { SummarizeNode } from "./nodes/summarize.node";
import { TitleNode } from "./nodes/title.node";
import { tools } from "./tools";

const graphRouter = async (state: typeof ChatState.State) => {
  const lastMessage = state.messages[state.messages.length - 1];

  if (
    lastMessage instanceof AIMessage &&
    lastMessage.tool_calls &&
    lastMessage.tool_calls.length > 0
  ) {
    console.log("[ROUTER] Routing to TOOLS");
    return "tools";
  }

  if (!state.title.trim()) {
    console.log("[ROUTER] Routing to TITLE");
    return "title";
  }

  if (state.messages.length > 10) {
    console.log("[ROUTER] Routing to SUMMARIZE");
    return "summarize";
  }

  console.log("[ROUTER] Routing to END");
  return "end";
};

export const graph = new StateGraph(ChatState)

  // Nodes
  .addNode("chat_node", ChatNode)
  .addNode("title_node", TitleNode)
  .addNode("summarize_node", SummarizeNode)
  .addNode("tool_node", new ToolNode(tools))

  // Start
  .addEdge(START, "chat_node")

  // Tool loop
  .addEdge("tool_node", "chat_node")

  // Terminal nodes
  .addEdge("summarize_node", END)
  .addEdge("title_node", END)

  // Router
  .addConditionalEdges("chat_node", graphRouter, {
    tools: "tool_node",
    summarize: "summarize_node",
    title: "title_node",
    end: END,
  });