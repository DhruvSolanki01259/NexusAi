import { checkpointer, store } from "./postgres";

export async function setupPostgres() {
  await checkpointer.setup();
  await store.setup();
}
