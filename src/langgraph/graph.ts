import { END, START, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "langchain";

import { ChatState } from "./states/chat.state";
import { ChatNode } from "./nodes/chat.node";
import { SummarizeNode } from "./nodes/summarize.node";
import { TitleNode } from "./nodes/title.node";
import { tools } from "./tools";
import { RememberNode } from "./nodes/remember.node";

const initialRouter = async (state: typeof ChatState.State) => {
  if (!state.title) {
    console.log("Routing to TITLE");
    return "title";
  }

  console.log("Routing to CHAT");
  return "chat";
};
const chatRouter = async (state: typeof ChatState.State) => {
  const lastMessage = state.messages.at(-1);
  if (
    lastMessage instanceof AIMessage &&
    lastMessage.tool_calls &&
    lastMessage.tool_calls.length > 0
  ) {
    console.log("Routing to TOOLS");
    return "tools";
  }

  console.log("Routing to REMEMBER");
  return "remember";
};
const summarizeRouter = async (state: typeof ChatState.State) => {
  if (state.messages.length > 10) {
    console.log("Routing to SUMMARIZE");
    return "summarize";
  }

  console.log("Routing to END");
  return "end";
};

export const graph = new StateGraph(ChatState)
  .addNode("chat_node", ChatNode)
  .addNode("title_node", TitleNode)
  .addNode("remember_node", RememberNode)
  .addNode("summarize_node", SummarizeNode)
  .addNode("tool_node", new ToolNode(tools))

  .addConditionalEdges(START, initialRouter, {
    title: "title_node",
    chat: "chat_node",
  })
  .addConditionalEdges("chat_node", chatRouter, {
    tools: "tool_node",
    remember: "remember_node",
  })
  .addConditionalEdges("remember_node", summarizeRouter, {
    summarize: "summarize_node",
    end: END,
  })

  .addEdge("title_node", "chat_node")
  .addEdge("tool_node", "chat_node")
  .addEdge("summarize_node", "remember_node");
