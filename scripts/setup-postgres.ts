import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function main() {
  const { setupPostgres } = await import("../src/langgraph/persistence/setup");

  await setupPostgres();
}

main().catch((error) => {
  console.error("PostgreSQL setup failed:", error);
  process.exit(1);
});
