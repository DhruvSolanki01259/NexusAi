import { InMemoryStore, MemorySaver } from "@langchain/langgraph";
import { graph } from "./graph";

export const checkpointer = new MemorySaver();
export const store = new InMemoryStore();

export const workflow = graph.compile({ checkpointer, store });
