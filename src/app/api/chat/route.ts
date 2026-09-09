import { getAuthenticatedUser } from "@/lib/api/getAuthenticatedUser";
import { getConversationConfig } from "@/lib/api/getConversationConfig";
import { getErrorDetails } from "@/lib/api/errorHandler";
import { errorResponse } from "@/lib/api/apiResponse";
import { workflow } from "@/langgraph/workflow";
import {
  encodeEvent,
  extractMessageContent,
  getNodeLabel,
} from "@/lib/api/streamHelper";
import Message from "@/lib/models/message.model";
import { HumanMessage } from "langchain";
import { NextRequest } from "next/server";
import Personalization from "@/lib/models/personalization.model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequestBody {
  conversationId?: string;
  query?: string;
}

interface StreamEvent {
  type: "token" | "status" | "done" | "error";
  content?: string;
  node?: string;
  message?: string;
  conversationId?: string;
  title?: string;
}

function isChatRequestBody(body: unknown): body is ChatRequestBody {
  return typeof body === "object" && body !== null;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();

    if ("error" in auth) {
      return auth.error;
    }

    const userId = auth.userId;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body", 400, {
        name: "ValidationError",
        message: "The request body must contain valid JSON.",
        cause: undefined,
      });
    }

    if (!isChatRequestBody(body)) {
      return errorResponse("Invalid request body", 400, {
        name: "ValidationError",
        message: "The request body must be a valid JSON object.",
        cause: undefined,
      });
    }

    const conversationId =
      typeof body.conversationId === "string" ? body.conversationId.trim() : "";

    if (!conversationId) {
      return errorResponse("Conversation ID is required", 400, {
        name: "ValidationError",
        message: "A valid conversation ID is required.",
        cause: undefined,
      });
    }

    const userQuery = body.query;

    if (typeof userQuery !== "string" || !userQuery.trim()) {
      return errorResponse("Query is required", 400, {
        name: "ValidationError",
        message: "A non-empty query is required.",
        cause: undefined,
      });
    }

    const query = userQuery.trim();

    try {
      // User message creation
      await Message.create({
        userId,
        conversationId,
        role: "user",
        content: query,
      });
    } catch (error) {
      const { name, message, cause } = getErrorDetails(error);

      console.error("Failed to create user message:", {
        name,
        message,
        cause,
      });

      return errorResponse("Failed to save message", 500, {
        name,
        message,
        cause,
      });
    }

    let config;

    try {
      const personalization = await Personalization.find({ userId }).lean();
      const {
        enabled,
        nickname,
        profession,
        interests,
        responseStyle,
        responseLength,
        technicalLevel,
        emojis,
        structuredResponses,
        instructions,
      } = personalization;
      config = getConversationConfig(conversationId, userId, {
        enabled,
        nickname,
        profession,
        interests,
        responseStyle,
        responseLength,
        technicalLevel,
        emojis,
        structuredResponses,
        instructions,
      });
    } catch (error) {
      const { name, message, cause } = getErrorDetails(error);

      console.error("Failed to create conversation config:", {
        name,
        message,
        cause,
      });

      return errorResponse("Failed to initialize conversation", 500, {
        name,
        message,
        cause,
      });
    }

    let result;

    try {
      result = await workflow.stream(
        {
          messages: [new HumanMessage(query)],
        },
        config,
      );
    } catch (error) {
      const { name, message, cause } = getErrorDetails(error);

      console.error("Failed to start LangGraph workflow:", {
        name,
        message,
        cause,
      });

      return errorResponse("Failed to invoke workflow", 500, {
        name,
        message,
        cause,
      });
    }

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let assistantContent = "";
        let generatedTitle = "";
        let streamClosed = false;

        const closeStream = () => {
          if (streamClosed) {
            return;
          }

          streamClosed = true;

          try {
            controller.close();
          } catch {}
        };

        const sendEvent = (event: StreamEvent) => {
          if (streamClosed) {
            return;
          }

          try {
            controller.enqueue(encodeEvent(encoder, event));
          } catch (error) {
            console.error("Failed to enqueue stream event:", error);
            streamClosed = true;
          }
        };

        const handleAbort = () => {
          console.log(`Chat stream aborted for conversation ${conversationId}`);

          streamClosed = true;

          try {
            controller.close();
          } catch {}
        };

        request.signal.addEventListener("abort", handleAbort, {
          once: true,
        });

        sendEvent({
          type: "status",
          node: "workflow",
          message: "Thinking",
        });

        try {
          for await (const chunk of result) {
            if (request.signal.aborted || streamClosed) {
              break;
            }

            if (!Array.isArray(chunk)) {
              continue;
            }

            const [mode, data] = chunk;

            if (mode === "messages") {
              if (!Array.isArray(data)) {
                continue;
              }

              const [message] = data;

              if (!message) {
                continue;
              }

              const token = extractMessageContent(message.content);

              if (!token) {
                continue;
              }

              assistantContent += token;

              sendEvent({
                type: "token",
                content: token,
              });
            }

            if (mode === "updates") {
              if (typeof data !== "object" || data === null) {
                continue;
              }

              const entries = Object.entries(data);

              for (const [nodeName, nodeData] of entries) {
                if (request.signal.aborted || streamClosed) {
                  break;
                }

                if (
                  typeof nodeData === "object" &&
                  nodeData !== null &&
                  "title" in nodeData
                ) {
                  const title = (nodeData as { title?: unknown }).title;

                  if (typeof title === "string" && title.trim()) {
                    generatedTitle = title.trim();
                  }
                }

                const label = getNodeLabel(nodeName);

                sendEvent({
                  type: "status",
                  node: nodeName,
                  message: `${label} completed`,
                });
              }
            }
          }

          if (request.signal.aborted) {
            console.log(`Client cancelled chat request: ${conversationId}`);

            return;
          }

          const finalAssistantContent = assistantContent.trim();

          if (!finalAssistantContent) {
            throw new Error("No assistant response was generated.");
          }

          // Assistant message creation
          await Message.create({
            userId,
            conversationId,
            role: "assistant",
            content: finalAssistantContent,
          });

          // Send title to frontend
          sendEvent({
            type: "done",
            conversationId,
            ...(generatedTitle ? { title: generatedTitle } : {}),
          });

          closeStream();
        } catch (error) {
          if (request.signal.aborted) {
            return;
          }

          const { name, message, cause } = getErrorDetails(error);

          console.error("Chat streaming error:", {
            name,
            message,
            cause,
            conversationId,
            userId,
          });

          sendEvent({
            type: "error",
            message: "Something went wrong while generating the response.",
          });

          closeStream();
        } finally {
          request.signal.removeEventListener("abort", handleAbort);
        }
      },

      cancel() {
        console.log(`Chat stream cancelled: ${conversationId}`);
      },
    });

    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("POST /api/chat error:", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to invoke workflow", 500, {
      name,
      message,
      cause,
    });
  }
}
