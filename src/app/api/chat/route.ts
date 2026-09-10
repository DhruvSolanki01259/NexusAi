import { getAuthenticatedUser } from "@/lib/api/getAuthenticatedUser";
import { getErrorDetails } from "@/lib/api/errorHandler";
import { errorResponse } from "@/lib/api/apiResponse";
import { workflow } from "@/langgraph/workflow";
import {
  encodeEvent,
  extractMessageContent,
  getNodeLabel,
} from "@/lib/api/streamHelper";

import Message from "@/lib/models/message.model";
import PersonalizationModel from "@/lib/models/personalization.model";

import { HumanMessage } from "langchain";
import { NextRequest } from "next/server";
import {
  getConversationConfig,
  getStreamNodeName,
  isChatRequestBody,
  Personalization,
  StreamEvent,
} from "@/lib/api/chatUtils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    const userQuery = typeof body.query === "string" ? body.query.trim() : "";
    if (!userQuery) {
      return errorResponse("Query is required", 400, {
        name: "ValidationError",
        message: "A non-empty query is required.",
        cause: undefined,
      });
    }

    // Save the user's message
    try {
      await Message.create({
        userId,
        conversationId,
        role: "user",
        content: userQuery,
      });
    } catch (error) {
      const { name, message, cause } = getErrorDetails(error);

      console.error("Failed to create user message:", {
        name,
        message,
        cause,
        conversationId,
        userId,
      });

      return errorResponse("Failed to save message", 500, {
        name,
        message,
        cause,
      });
    }

    // Load personalization
    let config;
    try {
      const personalizationDocument = await PersonalizationModel.findOne({
        userId,
      }).lean();

      const personalization: Personalization = {
        enabled: personalizationDocument?.enabled ?? false,
        nickname: personalizationDocument?.nickname ?? "",
        profession: personalizationDocument?.profession ?? "",
        interests: personalizationDocument?.interests ?? "",
        responseStyle: personalizationDocument?.responseStyle ?? "",
        responseLength: personalizationDocument?.responseLength ?? "",
        technicalLevel: personalizationDocument?.technicalLevel ?? "",
        emojis: personalizationDocument?.emojis ?? false,
        structuredResponses:
          personalizationDocument?.structuredResponses ?? false,
        instructions: personalizationDocument?.instructions ?? "",
      };

      config = getConversationConfig(conversationId, userId, personalization);
    } catch (error) {
      const { name, message, cause } = getErrorDetails(error);

      console.error("Failed to create conversation config:", {
        name,
        message,
        cause,
        conversationId,
        userId,
      });

      return errorResponse("Failed to initialize conversation", 500, {
        name,
        message,
        cause,
      });
    }

    // Start LangGraph stream
    let result;
    try {
      result = await workflow.stream(
        {
          messages: [new HumanMessage(userQuery)],
        },
        config,
      );
    } catch (error) {
      const { name, message, cause } = getErrorDetails(error);

      console.error("Failed to start LangGraph workflow:", {
        name,
        message,
        cause,
        conversationId,
        userId,
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
          } catch {
            // Stream may already be closed by the runtime.
          }
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
          } catch {
            // Stream is already closed.
          }
        };

        request.signal.addEventListener("abort", handleAbort, {
          once: true,
        });

        // Tell the frontend that the graph has started.
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

              const nodeName = getStreamNodeName(data);

              if (nodeName && nodeName !== "chat_node") {
                continue;
              }

              const [messageChunk] = data;

              if (!messageChunk) {
                continue;
              }

              const token = extractMessageContent(messageChunk.content);

              if (!token) {
                continue;
              }

              assistantContent += token;

              sendEvent({
                type: "token",
                content: token,
              });

              continue;
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

                // Title generated by TitleNode
                if (
                  typeof nodeData === "object" &&
                  nodeData !== null &&
                  "title" in nodeData
                ) {
                  const title = (
                    nodeData as {
                      title?: unknown;
                    }
                  ).title;

                  if (typeof title === "string" && title.trim()) {
                    generatedTitle = title.trim();

                    sendEvent({
                      type: "title",
                      title: generatedTitle,
                      conversationId,
                    });
                  }
                }

                // Node status
                const label = getNodeLabel(nodeName);

                sendEvent({
                  type: "status",
                  node: nodeName,
                  message: `${label} completed`,
                });
              }
            }
          }

          // Client cancelled the request
          if (request.signal.aborted) {
            console.log(`Client cancelled chat request: ${conversationId}`);

            return;
          }

          // Validate final assistant response
          const finalAssistantContent = assistantContent.trim();
          if (!finalAssistantContent) {
            throw new Error("No assistant response was generated.");
          }

          // Save completed assistant response
          try {
            await Message.create({
              userId,
              conversationId,
              role: "assistant",
              content: finalAssistantContent,
            });
          } catch (error) {
            const { name, message, cause } = getErrorDetails(error);

            console.error("Failed to save assistant message:", {
              name,
              message,
              cause,
              conversationId,
              userId,
            });

            throw error;
          }

          // Tell frontend generation is complete
          sendEvent({
            type: "done",
            conversationId,
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
        "X-Accel-Buffering": "no",
        Connection: "keep-alive",
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
