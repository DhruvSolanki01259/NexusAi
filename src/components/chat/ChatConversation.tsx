"use client";

import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowUp,
  Check,
  CircleStop,
  Sparkles,
  X,
} from "lucide-react";

import { MessageBubble } from "./messages/MessageBubble";
import { NexusAvatar } from "./NexusAvatar";
import { getStatusIcon } from "./messages/streaming/Icon";

import {
  createMessageId,
  extractMessagesFromResponse,
  formatNodeName,
  getCurrentMessageDate,
  getNodeStatus,
  normalizeMessages,
  parseStreamLine,
} from "@/utils/streaming/streamingUtils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

interface MessagesResponse {
  data?: unknown;
  id?: string;
  title?: string;
  messages?: unknown;
  conversation?: {
    id?: string;
    title?: string;
    messages?: unknown;
  };
}

interface ConversationResponse {
  data?: {
    id?: string;
    title?: string;
    userId?: string;
  };
  id?: string;
  title?: string;
}

interface GenerationStatus {
  node: string;
  message: string;
  type: "thinking" | "memory" | "tool" | "generating" | "workflow";
}

interface ChatStreamEvent {
  type: "token" | "status" | "done" | "error";
  content?: string;
  node?: string;
  message?: string;
  conversationId?: string;
  title?: string;
}

interface ChatConversationProps {
  conversationId: string;
}

const INITIAL_TITLE = "New Conversation";
const MAX_MESSAGE_LENGTH = 12000;

export function ChatConversationContent({
  conversationId,
}: ChatConversationProps) {
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [showMobileTitle, setShowMobileTitle] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [title, setTitle] = useState(INITIAL_TITLE);
  const [input, setInput] = useState("");

  const chatAbortControllerRef = useRef<AbortController | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const streamingAssistantIdRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const persistedTitleRef = useRef<string | null>(null);

  const loadConversation = useCallback(
    async (signal?: AbortSignal) => {
      if (!conversationId) {
        return;
      }

      const response = await fetch(
        `/api/conversations/${encodeURIComponent(conversationId)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal,
        },
      );

      if (!response.ok) {
        let message = "Failed to load conversation.";

        try {
          const errorPayload = await response.json();

          message =
            errorPayload?.message ||
            errorPayload?.error ||
            errorPayload?.data?.message ||
            message;
        } catch {}

        throw new Error(message);
      }

      const payload: ConversationResponse = await response.json();

      const conversationTitle =
        payload?.data?.title?.trim() || payload?.title?.trim() || "";

      if (conversationTitle) {
        setTitle(conversationTitle);
        persistedTitleRef.current = conversationTitle;
      } else {
        setTitle(INITIAL_TITLE);
        persistedTitleRef.current = null;
      }
    },
    [conversationId],
  );

  const persistConversationTitle = useCallback(
    async (generatedTitle: string) => {
      const normalizedTitle = generatedTitle.trim();

      if (!conversationId || !normalizedTitle) {
        return;
      }
      if (persistedTitleRef.current === normalizedTitle) {
        return;
      }

      try {
        const response = await fetch(
          `/api/conversations/${encodeURIComponent(conversationId)}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              title: normalizedTitle,
            }),
          },
        );

        if (!response.ok) {
          let message = "Failed to save conversation title.";

          try {
            const errorPayload = await response.json();

            message =
              errorPayload?.message ||
              errorPayload?.error ||
              errorPayload?.data?.message ||
              message;
          } catch {}

          throw new Error(message);
        }

        setTitle(normalizedTitle);
        persistedTitleRef.current = normalizedTitle;
      } catch (error) {
        console.error(
          "[Conversation PATCH] Failed to persist conversation title:",
          error,
        );
      }
    },
    [conversationId],
  );

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const controller = new AbortController();

    const loadMessages = async () => {
      setIsLoadingConversation(true);

      try {
        await loadConversation(controller.signal);

        if (controller.signal.aborted) {
          return;
        }
        const response = await fetch(
          `/api/messages/${encodeURIComponent(conversationId)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          let message = "Failed to load conversation.";

          try {
            const errorPayload = await response.json();

            message =
              errorPayload?.message ||
              errorPayload?.error ||
              errorPayload?.data?.message ||
              message;
          } catch {}

          throw new Error(message);
        }

        const payload: MessagesResponse = await response.json();

        if (controller.signal.aborted) {
          return;
        }
        const rawMessages = extractMessagesFromResponse(payload);
        const normalizedMessages = normalizeMessages(rawMessages);

        setMessages(normalizedMessages);
        setErrorMessage(null);
        setIsGenerating(false);
        setStatus(null);
        setCompletedNodes([]);
        shouldAutoScrollRef.current = true;

        requestAnimationFrame(() => {
          if (controller.signal.aborted) {
            return;
          }

          bottomRef.current?.scrollIntoView({
            behavior: "auto",
            block: "end",
          });
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        if (controller.signal.aborted) {
          return;
        }

        console.error(
          "[Conversation / Messages GET] Failed to load conversation:",
          error,
        );

        setMessages([]);

        setErrorMessage(
          error instanceof Error && error.message
            ? error.message
            : "Unable to load this conversation. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingConversation(false);
        }
      }
    };

    void loadMessages();

    return () => {
      controller.abort();
    };
  }, [conversationId, loadConversation]);

  const conversationIsLoading =
    Boolean(conversationId) && isLoadingConversation;

  const visibleErrorMessage = !conversationId
    ? "Conversation ID is missing."
    : errorMessage;

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    const nextHeight = Math.min(textarea.scrollHeight, 160);

    textarea.style.height = `${nextHeight}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [input, resizeTextarea]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (!shouldAutoScrollRef.current) {
      return;
    }

    bottomRef.current?.scrollIntoView({
      behavior,
      block: "end",
    });
  }, []);

  useEffect(() => {
    if (!messages.length) {
      return;
    }

    scrollToBottom("smooth");
  }, [messages, scrollToBottom]);

  const updateStatus = useCallback((event: ChatStreamEvent) => {
    if (event.type !== "status") {
      return;
    }

    const node = event.node || "workflow";

    setStatus(getNodeStatus(node));

    setCompletedNodes((previous) => {
      if (previous.includes(node)) {
        return previous;
      }

      const statusMessage = event.message?.toLowerCase() || "";

      if (
        statusMessage.includes("completed") ||
        statusMessage.includes("complete")
      ) {
        return [...previous, node];
      }

      return previous;
    });
  }, []);

  const handleStreamEvent = useCallback(
    (
      streamEvent: ChatStreamEvent,
      generatedTitleRef: { current: string | null },
    ) => {
      if (streamEvent.type === "status") {
        updateStatus(streamEvent);
        return;
      }

      if (streamEvent.title?.trim()) {
        generatedTitleRef.current = streamEvent.title.trim();
      }

      if (streamEvent.type === "token") {
        const token = streamEvent.content || "";

        if (!token) {
          return;
        }

        const assistantId =
          streamingAssistantIdRef.current || createMessageId();

        if (!streamingAssistantIdRef.current) {
          streamingAssistantIdRef.current = assistantId;

          setMessages((previous) => [
            ...previous,
            {
              id: assistantId,
              role: "assistant",
              content: token,
              createdAt: getCurrentMessageDate(),
            },
          ]);
        } else {
          setMessages((previous) =>
            previous.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    content: `${message.content}${token}`,
                  }
                : message,
            ),
          );
        }

        return;
      }

      if (streamEvent.type === "error") {
        setErrorMessage(
          streamEvent.message ||
            "Something went wrong while generating the response.",
        );

        setIsGenerating(false);
        setStatus(null);
        return;
      }

      if (streamEvent.type === "done") {
        setStatus(null);
      }
    },
    [updateStatus],
  );

  const refreshMessages = useCallback(async () => {
    if (!conversationId) {
      return;
    }

    try {
      const response = await fetch(
        `/api/messages/${encodeURIComponent(conversationId)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        return;
      }

      const payload: MessagesResponse = await response.json();

      const rawMessages = extractMessagesFromResponse(payload);
      const normalizedMessages = normalizeMessages(rawMessages);

      setMessages(normalizedMessages);

      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    } catch (error) {
      console.error(
        "[Conversation / Messages GET] Failed to refresh messages:",
        error,
      );
    }
  }, [conversationId]);

  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      if (isGenerating) {
        return;
      }

      const query = input.trim();

      if (!query) {
        return;
      }

      if (!conversationId) {
        setErrorMessage("Conversation ID is missing.");
        return;
      }

      if (query.length > MAX_MESSAGE_LENGTH) {
        setErrorMessage(
          `Message cannot exceed ${MAX_MESSAGE_LENGTH.toLocaleString()} characters.`,
        );
        return;
      }

      chatAbortControllerRef.current?.abort();

      const controller = new AbortController();

      chatAbortControllerRef.current = controller;

      const generatedTitleRef: { current: string | null } = {
        current: null,
      };

      setErrorMessage(null);
      setIsGenerating(true);
      setStatus({
        node: "workflow",
        message: "Thinking",
        type: "workflow",
      });
      setCompletedNodes([]);

      const userMessage: Message = {
        id: createMessageId(),
        role: "user",
        content: query,
        createdAt: getCurrentMessageDate(),
      };

      setMessages((previous) => [...previous, userMessage]);

      setInput("");

      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      });

      streamingAssistantIdRef.current = null;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/x-ndjson",
          },
          body: JSON.stringify({
            conversationId,
            query,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          let message = "Failed to generate a response.";

          try {
            const errorPayload = await response.json();

            message =
              errorPayload?.message ||
              errorPayload?.error ||
              errorPayload?.data?.message ||
              message;
          } catch {}

          throw new Error(message);
        }

        if (!response.body) {
          throw new Error("The server returned an empty response stream.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            break;
          }

          if (controller.signal.aborted) {
            break;
          }

          buffer += decoder.decode(value, {
            stream: true,
          });

          const lines = buffer.split("\n");

          buffer = lines.pop() || "";

          for (const line of lines) {
            if (controller.signal.aborted) {
              break;
            }

            const trimmedLine = line.trim();

            if (!trimmedLine) {
              continue;
            }

            try {
              const parsedEvent = parseStreamLine(trimmedLine);

              if (!parsedEvent) {
                continue;
              }

              handleStreamEvent(
                parsedEvent as ChatStreamEvent,
                generatedTitleRef,
              );

              if (parsedEvent.type === "error") {
                break;
              }
            } catch (error) {
              console.error(
                "[Chat Stream] Failed to parse stream event:",
                error,
              );
            }
          }

          scrollToBottom("smooth");
        }

        buffer += decoder.decode();

        if (!controller.signal.aborted && buffer.trim()) {
          try {
            const parsedEvent = parseStreamLine(buffer.trim());

            if (parsedEvent) {
              handleStreamEvent(
                parsedEvent as ChatStreamEvent,
                generatedTitleRef,
              );
            }
          } catch (error) {
            console.error(
              "[Chat Stream] Failed to parse final stream event:",
              error,
            );
          }
        }

        if (controller.signal.aborted) {
          return;
        }

        if (generatedTitleRef.current) {
          await persistConversationTitle(generatedTitleRef.current);
        }

        await refreshMessages();

        setIsGenerating(false);
        setStatus(null);
        setCompletedNodes([]);
      } catch (error) {
        if (
          controller.signal.aborted ||
          (error instanceof DOMException && error.name === "AbortError") ||
          (error instanceof Error && error.name === "AbortError")
        ) {
          return;
        }

        console.error("[Chat Stream] Failed to generate response:", error);

        setErrorMessage(
          error instanceof Error && error.message
            ? error.message
            : "Something went wrong while generating the response.",
        );

        setIsGenerating(false);
        setStatus(null);
      } finally {
        if (chatAbortControllerRef.current === controller) {
          chatAbortControllerRef.current = null;
        }

        streamingAssistantIdRef.current = null;
      }
    },
    [
      conversationId,
      handleStreamEvent,
      input,
      isGenerating,
      persistConversationTitle,
      refreshMessages,
      scrollToBottom,
    ],
  );

  const handleStopGeneration = useCallback(() => {
    chatAbortControllerRef.current?.abort();

    chatAbortControllerRef.current = null;

    setIsGenerating(false);
    setStatus(null);
    setCompletedNodes([]);

    streamingAssistantIdRef.current = null;
  }, []);

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Enter") {
        return;
      }

      if (event.shiftKey) {
        return;
      }

      event.preventDefault();

      if (!isGenerating && input.trim()) {
        void handleSubmit();
      }
    },
    [handleSubmit, input, isGenerating],
  );

  const toggleMobileTitle = useCallback(() => {
    setShowMobileTitle((previous) => !previous);
  }, []);

  useEffect(() => {
    return () => {
      chatAbortControllerRef.current?.abort();
      chatAbortControllerRef.current = null;
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[#0b0d0d] text-white">
      <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-[#202525] px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <NexusAvatar size="sm" />

          <div className="hidden min-w-0 md:block">
            <h1 className="truncate text-sm font-semibold text-white">
              {title}
            </h1>

            <p className="text-[11px] text-[#7f8b87]">NEXUS AI</p>
          </div>

          <div
            // type="button"
            // onClick={toggleMobileTitle}
            className="flex min-w-0 items-center gap-1 md:hidden"
            aria-expanded={showMobileTitle}
            aria-label="Toggle conversation title"
          >
            <span className="max-w-45 truncate text-sm font-semibold text-white">
              {title}
            </span>

            
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isGenerating && (
            <div className="flex items-center gap-2 rounded-full border border-[#303737] bg-[#111515] px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#23ce6b]" />

              <span className="hidden text-[11px] text-[#a8b2ae] sm:inline">
                {status?.message || "Thinking"}
              </span>
            </div>
          )}
        </div>

        {showMobileTitle && (
          <div className="absolute left-0 right-0 top-full z-20 border-b border-[#202525] bg-[#0b0d0d] px-4 py-3 shadow-xl md:hidden">
            <p className="truncate text-xs text-[#8d9995]">{title}</p>
          </div>
        )}
      </header>

      <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-6 md:px-6 md:py-8">
          {conversationIsLoading ? (
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#23ce6b]" />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#23ce6b]"
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#23ce6b]"
                    style={{ animationDelay: "240ms" }}
                  />
                </div>

                <span className="text-xs text-[#7f8b87]">
                  Loading conversation...
                </span>
              </div>
            </div>
          ) : (
            <>
              {visibleErrorMessage && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#3a2929] bg-[#171010] px-4 py-3">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

                    <p className="text-sm leading-6 text-[#d8b8b8]">
                      {visibleErrorMessage}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="shrink-0 rounded-md p-1 text-[#8d7777] transition hover:bg-[#251818] hover:text-white"
                    aria-label="Dismiss error"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {messages.length === 0 && !errorMessage && (
                <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#26302c] bg-[#111615] shadow-[0_0_30px_rgba(35,206,107,0.06)]">
                    <Sparkles className="h-6 w-6 text-[#23ce6b]" />
                  </div>

                  <h2 className="text-lg font-semibold text-white">
                    How can I help?
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-[#7f8b87]">
                    Ask anything. NEXUS will reason through the request and
                    stream the response here.
                  </p>
                </div>
              )}

              {messages.length > 0 && (
                <div className="space-y-6">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={{
                        ...message,
                        content: message.content,
                      }}
                    />
                  ))}
                </div>
              )}

              {isGenerating && status && (
                <div className="mt-5 flex items-start gap-3">
                  <NexusAvatar size="sm" />

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-medium text-[#9aa6a2]">
                        NEXUS
                      </span>

                      <span className="text-[10px] text-[#56615e]">
                        {formatNodeName(status.node)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-[#202828] bg-[#101313] px-3 py-2.5">
                      <span className="text-[#23ce6b]">
                        {getStatusIcon(status.type)}
                      </span>

                      <span className="text-xs text-[#8e9995]">
                        {status.message}
                      </span>

                      <span className="ml-1 flex items-center gap-1">
                        <span className="h-1 w-1 animate-pulse rounded-full bg-[#6b7773]" />
                        <span
                          className="h-1 w-1 animate-pulse rounded-full bg-[#6b7773]"
                          style={{ animationDelay: "120ms" }}
                        />
                        <span
                          className="h-1 w-1 animate-pulse rounded-full bg-[#6b7773]"
                          style={{ animationDelay: "240ms" }}
                        />
                      </span>
                    </div>

                    {completedNodes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {completedNodes.map((node) => (
                          <div
                            key={node}
                            className="flex items-center gap-1 rounded-md border border-[#242c29] bg-[#101413] px-2 py-1"
                          >
                            <Check className="h-3 w-3 text-[#23ce6b]" />

                            <span className="text-[10px] text-[#697571]">
                              {formatNodeName(node)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div ref={bottomRef} className="h-2" />
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-[#202525] bg-[#0b0d0d] px-3 pb-3 pt-3 sm:px-4 sm:pb-4 md:px-6 md:pt-4">
        <div className="mx-auto w-full max-w-4xl">
          <form onSubmit={handleSubmit}>
            <div className="relative overflow-hidden rounded-2xl border border-[#2b3331] bg-[#151918] shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition duration-200 focus-within:border-[#3a4542] focus-within:shadow-[0_8px_36px_rgba(0,0,0,0.3)]">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Message NEXUS..."
                disabled={isGenerating}
                rows={1}
                maxLength={MAX_MESSAGE_LENGTH}
                className="block max-h-48 min-h-14 w-full resize-none overflow-y-auto bg-transparent px-4 pb-14 pt-4 text-sm leading-6 text-[#edf5fc] outline-none placeholder:text-[#697171] disabled:cursor-not-allowed disabled:opacity-50"
              />

              <div className="pointer-events-none absolute bottom-3 left-4 right-3 flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="hidden truncate text-[10px] text-[#5c6763] sm:inline">
                    Enter to send · Shift + Enter for newline
                  </span>

                  {input.length > MAX_MESSAGE_LENGTH * 0.9 && (
                    <span className="text-[10px] text-[#8d7777]">
                      {input.length.toLocaleString()}/
                      {MAX_MESSAGE_LENGTH.toLocaleString()}
                    </span>
                  )}
                </div>

                {isGenerating ? (
                  <button
                    type="button"
                    onClick={handleStopGeneration}
                    className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-xl border border-[#383f3d] bg-[#1b211f] text-[#a7b0ad] transition hover:border-[#4a5551] hover:bg-[#222a27] hover:text-white"
                    aria-label="Stop generation"
                  >
                    <CircleStop className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={
                      !input.trim() || input.length > MAX_MESSAGE_LENGTH
                    }
                    className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#23ce6b] text-[#0b0d0d] shadow-[0_4px_14px_rgba(35,206,107,0.14)] transition hover:bg-[#31dc78] disabled:cursor-not-allowed disabled:bg-[#26302c] disabled:text-[#56615e] disabled:shadow-none"
                    aria-label="Send message"
                  >
                    <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
          </form>

          <p className="mt-2 text-center text-[10px] leading-4 text-[#4b5652]">
            NEXUS can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
