import z from "zod";

export const RememberSchema = z.object({
  memories: z
    .array(
      z.object({
        operation: z
          .enum(["create", "update", "delete", "none"])
          .default("none")
          .describe(
            "CRUD operation for the memory. Use create for a new memory, update to modify an existing memory, delete to remove an existing memory, and none when nothing should be changed.",
          ),

        memoryId: z
          .string()
          .default("")
          .describe(
            "Existing memory ID. Required for update and delete. Use the exact memoryId from the existing memory context. For create and none, use an empty string.",
          ),

        category: z
          .enum([
            "profile",
            "preferences",
            "communication",
            "goals",
            "skills",
            "projects",
            "work",
            "education",
            "learnings",
            "technology",
            "interests",
            "hobbies",
            "fitness",
            "health",
            "lifestyle",
            "travel",
            "relationships",
            "reminders",
            "decisions",
            "constraints",
            "others",
          ])
          .default("others")
          .describe("Category of the memory."),

        value: z
          .string()
          .default("")
          .describe(
            "Concise factual memory about the user. For create, this is the new memory. For update, this is the replacement value. For delete and none, leave it empty.",
          ),
      }),
    )
    .default([])
    .describe(
      "List of memory operations to perform based on the user's message and existing memories.",
    ),
});

export type Remember = z.infer<typeof RememberSchema>;

