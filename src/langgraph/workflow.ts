import { checkpointer, store } from "./persistence/postgres";
import { graph } from "./graph";

export const workflow = graph.compile({ checkpointer, store });
