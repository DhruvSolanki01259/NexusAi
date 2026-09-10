import { PostgresStore } from "@langchain/langgraph-checkpoint-postgres/store";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { loadEnv } from "@/utils/loadEnv";

const DB_URI = loadEnv.PostgresDatabaseUrl;

if (!DB_URI) {
  throw new Error("POSTGRES_DATABASE_URL is not defined");
}

export const checkpointer = PostgresSaver.fromConnString(DB_URI);
export const store = PostgresStore.fromConnString(DB_URI);
