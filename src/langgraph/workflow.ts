import { MemorySaver } from "@langchain/langgraph";
import { graph } from "./graph";

const checkpointer = new MemorySaver();

export const workflow = graph.compile({ checkpointer });
