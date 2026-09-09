import { tavilyClient } from "@/ai_components/models/web-search/tavily";
import { tool } from "langchain";
import z from "zod";

export const WebSearchTool = tool(
  async ({ query }) => {
    try {
      const response = await tavilyClient.search(query, {
        searchDepth: "advanced",
        maxResults: 10,
        includeAnswer: false,
        includeRawContent: false,
      });

      if (!response.results?.length) {
        return {
          success: false,
          query,
          resultCount: 0,
          results: [],
          message: "No relevant search results were found.",
        };
      }

      const results = response.results.slice(0, 5).map((result, index) => ({
        position: index + 1,
        title: result.title?.trim() || "Untitled",
        url: result.url,
        snippet: result.content?.trim() || "",
        relevanceScore: result.score ?? null,
        publishedDate: result.publishedDate ?? null,
      }));

      return {
        success: true,
        query,
        resultCount: results.length,
        results,
      };
    } catch (error) {
      console.error("[NEXUS WEB SEARCH ERROR]", error);

      return {
        success: false,
        query,
        resultCount: 0,
        results: [],
        message:
          error instanceof Error ? error.message : "Failed to search the web.",
      };
    }
  },
  {
    name: "web_search",
    description:
      "Search the internet for current and relevant information. Use this tool when answering questions that require up-to-date information, recent events, news, online research, or facts that may have changed. The tool searches multiple web sources and returns up to 5 of the most relevant results with their titles, URLs, content snippets, relevance scores, and publication dates. Always use this tool instead of relying only on internal knowledge when the user explicitly asks for current or recent information.",
    schema: z.object({
      query: z
        .string()
        .min(2, "Search query must contain at least 2 characters.")
        .describe(
          "A concise and specific query to search for on the internet. Include important names, topics, dates, or keywords needed to find accurate results.",
        ),
    }),
  },
);
