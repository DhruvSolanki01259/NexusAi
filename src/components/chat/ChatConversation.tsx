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
  ChevronDown,
  ChevronUp,
  CircleStop,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { MessageBubble } from "./messages/MessageBubble";
import { NexusAvatar } from "./NexusAvatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

interface MessagesResponse {
  data?: {
    id?: string;
    title?: string;
    messages?: Message[];
    conversation?: {
      id?: string;
      title?: string;
    };
  };
  id?: string;
  title?: string;
  messages?: Message[];
  conversation?: {
    id?: string;
    title?: string;
  };
}

interface StreamEvent {
  type: "token" | "status" | "done" | "error" | "started" | "completed";
  content?: string;
  message?: string;
  node?: string;
  status?: "started" | "completed";
  conversationId?: string;
  error?: string;
}

interface GenerationStatus {
  node: string;
  message: string;
  type: "thinking" | "memory" | "tool" | "generating" | "workflow";
}

interface ChatConversationProps {
  conversationId: string;
}

const INITIAL_TITLE = "New Conversation";
const MAX_MESSAGE_LENGTH = 12000;

function createMessageId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatNodeName(node: string) {
  return node
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getNodeStatus(node: string): GenerationStatus {
  const normalized = node.toLowerCase();

  if (
    normalized.includes("memory") ||
    normalized.includes("retrieve") ||
    normalized.includes("retrieval") ||
    normalized.includes("search")
  ) {
    return {
      node,
      message: "Searching memory",
      type: "memory",
    };
  }

  if (
    normalized.includes("tool") ||
    normalized.includes("browser") ||
    normalized.includes("api") ||
    normalized.includes("web")
  ) {
    return {
      node,
      message: "Using tools",
      type: "tool",
    };
  }

  if (
    normalized.includes("reason") ||
    normalized.includes("think") ||
    normalized.includes("agent") ||
    normalized.includes("planner") ||
    normalized.includes("planning")
  ) {
    return {
      node,
      message: "Thinking",
      type: "thinking",
    };
  }

  if (
    normalized.includes("model") ||
    normalized.includes("llm") ||
    normalized.includes("generate") ||
    normalized.includes("response")
  ) {
    return {
      node,
      message: "Generating response",
      type: "generating",
    };
  }

  return {
    node,
    message: formatNodeName(node),
    type: "workflow",
  };
}

function getStatusIcon(type: GenerationStatus["type"]) {
  switch (type) {
    case "memory":
      return <Sparkles className="h-3.5 w-3.5" />;

    case "tool":
      return <Wrench className="h-3.5 w-3.5" />;

    case "thinking":
    case "generating":
    case "workflow":
    default:
      return <Sparkles className="h-3.5 w-3.5" />;
  }
}

function normalizeMessage(
  message: Partial<Message> & {
    _id?: string;
  },
): Message | null {
  if (message.role !== "user" && message.role !== "assistant") {
    return null;
  }

  if (typeof message.content !== "string") {
    return null;
  }

  return {
    id: message.id || message._id || createMessageId(),
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
  };
}

function extractMessagesPayload(payload: MessagesResponse | Message[]) {
  if (Array.isArray(payload)) {
    return {
      title: INITIAL_TITLE,
      messages: payload
        .map((message) => normalizeMessage(message))
        .filter((message): message is Message => Boolean(message)),
    };
  }

  const data = payload?.data;

  const rawMessages = data?.messages || payload?.messages || [];

  const title =
    data?.title ||
    payload?.title ||
    data?.conversation?.title ||
    payload?.conversation?.title ||
    INITIAL_TITLE;

  return {
    title,
    messages: rawMessages
      .map((message) => normalizeMessage(message))
      .filter((message): message is Message => Boolean(message)),
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong while generating the response.";
}

export function ChatConversationContent({
  conversationId,
}: ChatConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState(INITIAL_TITLE);
  const [showMobileTitle, setShowMobileTitle] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadAbortControllerRef = useRef<AbortController | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const requestIdRef = useRef(0);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    const controller = new AbortController();

    loadAbortControllerRef.current = controller;

    requestIdRef.current += 1;

    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    shouldAutoScrollRef.current = true;

    const loadConversation = async () => {
      try {
        const response = await fetch(`/api/messages/${conversationId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        });

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

        const payload: MessagesResponse | Message[] = await response.json();

        if (controller.signal.aborted) {
          return;
        }

        const conversation = extractMessagesPayload(payload);

        setTitle(conversation.title || INITIAL_TITLE);
        setMessages(conversation.messages);

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

        console.error("Failed to load conversation:", error);

        setMessages([]);

        setErrorMessage("Unable to load this conversation. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingConversation(false);
        }
      }
    };

    void loadConversation();

    return () => {
      controller.abort();

      if (loadAbortControllerRef.current === controller) {
        loadAbortControllerRef.current = null;
      }

      abortControllerRef.current?.abort();
      abortControllerRef.current = null;

      requestIdRef.current += 1;
    };
  }, [conversationId]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    shouldAutoScrollRef.current = distanceFromBottom < 120;
  }, []);

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
    if (!isGenerating) {
      return;
    }

    scrollToBottom("auto");
  }, [messages, status, isGenerating, scrollToBottom]);

  const autoResizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    const nextHeight = Math.min(textarea.scrollHeight, 192);

    textarea.style.height = `${nextHeight}px`;
  }, []);

  useEffect(() => {
    autoResizeTextarea();
  }, [input, autoResizeTextarea]);

  const updateAssistantMessage = useCallback(
    (assistantId: string, content: string) => {
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content,
              }
            : message,
        ),
      );
    },
    [],
  );

  const streamResponse = useCallback(
    async (query: string, assistantMessageId: string, requestId: number) => {
      const controller = new AbortController();

      abortControllerRef.current = controller;

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
          cache: "no-store",
        });

        if (!response.ok) {
          let serverMessage = "Failed to generate a response.";

          try {
            const errorPayload = await response.json();

            serverMessage =
              errorPayload?.message ||
              errorPayload?.error ||
              errorPayload?.data?.message ||
              serverMessage;
          } catch {}
          throw new Error(serverMessage);
        }

        if (!response.body) {
          throw new Error("The server did not return a streaming response.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let buffer = "";
        let assistantContent = "";

        const processLine = (line: string) => {
          const trimmedLine = line.trim();

          if (!trimmedLine) return;

          let event: StreamEvent;
          try {
            event = JSON.parse(trimmedLine);
          } catch (error) {
            console.warn("Invalid streaming event:", {
              line: trimmedLine,
              error,
            });

            return;
          }

          if (requestId !== requestIdRef.current) return;
          if (event.conversationId && event.conversationId !== conversationId)
            return;

          switch (event.type) {
            case "token": {
              if (!event.content) {
                return;
              }

              assistantContent += event.content;
              updateAssistantMessage(assistantMessageId, assistantContent);
              setStatus(null);
              break;
            }

            case "started": {
              const node = event.node || "workflow";
              setStatus(getNodeStatus(node));
              break;
            }

            case "status": {
              const node = event.node || "workflow";
              const nextStatus = getNodeStatus(node);

              setStatus({
                ...nextStatus,
                message: event.message || nextStatus.message,
              });

              break;
            }

            case "completed": {
              const node = event.node || "workflow";

              setCompletedNodes((current) => {
                if (current.includes(node)) {
                  return current;
                }
                return [...current, node];
              });

              break;
            }

            case "done": {
              setStatus(null);
              break;
            }

            case "error": {
              throw new Error(
                event.message || event.error || "Streaming failed.",
              );
            }

            default:
              break;
          }
        };

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, {
            stream: true,
          });

          const lines = buffer.split("\n");

          buffer = lines.pop() ?? "";

          for (const line of lines) {
            processLine(line);
          }
        }

        buffer += decoder.decode();

        if (buffer.trim()) {
          const remainingLines = buffer.split("\n");

          for (const line of remainingLines) {
            processLine(line);
          }
        }

        if (!assistantContent.trim()) {
          throw new Error("NEXUS did not generate a response.");
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        if (requestId !== requestIdRef.current) {
          return;
        }

        console.error("Chat streaming error:", error);

        setErrorMessage(getErrorMessage(error));

        setMessages((currentMessages) =>
          currentMessages.filter(
            (message) =>
              message.id !== assistantMessageId ||
              message.content.trim().length > 0,
          ),
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setIsGenerating(false);
          setStatus(null);

          if (abortControllerRef.current === controller) {
            abortControllerRef.current = null;
          }

          requestAnimationFrame(() => {
            textareaRef.current?.focus();
          });
        }
      }
    },
    [conversationId, updateAssistantMessage],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = input.trim();

    if (!query || isGenerating || isLoadingConversation) {
      return;
    }

    if (query.length > MAX_MESSAGE_LENGTH) {
      setErrorMessage(
        `Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH.toLocaleString()} characters.`,
      );

      return;
    }

    setErrorMessage(null);
    setShowMobileTitle(false);

    shouldAutoScrollRef.current = true;

    const userMessage: Message = {
      id: createMessageId(),
      role: "user",
      content: query,
    };

    const assistantMessage: Message = {
      id: createMessageId(),
      role: "assistant",
      content: "",
    };

    const currentRequestId = requestIdRef.current + 1;

    requestIdRef.current = currentRequestId;

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ]);

    setInput("");

    setIsGenerating(true);

    setStatus({
      node: "workflow",
      message: "Thinking",
      type: "thinking",
    });

    setCompletedNodes([]);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      scrollToBottom("smooth");
    });

    await streamResponse(query, assistantMessage.id, currentRequestId);
  };

  const handleStopGeneration = () => {
    requestIdRef.current += 1;

    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    setIsGenerating(false);
    setStatus(null);

    setMessages((currentMessages) =>
      currentMessages.filter(
        (message) =>
          message.role !== "assistant" || message.content.trim().length > 0,
      ),
    );

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);

    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    if (event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (!isGenerating && !isLoadingConversation && input.trim()) {
      event.currentTarget.form?.requestSubmit();
    }
  };

  const dismissError = () => {
    setErrorMessage(null);
  };

  return (
    <div className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#0b0d0d]">
      {/* Desktop Header */}
      <header className="hidden h-14 shrink-0 items-center justify-center border-b border-[#303737] bg-[#0b0d0d]/95 px-6 backdrop-blur-xl lg:flex">
        <div className="min-w-0 max-w-xl text-center">
          <h1 className="truncate text-sm font-medium text-[#edf5fc]">
            {title}
          </h1>
        </div>
      </header>

      {/* Mobile Header / Title */}
      <div className="absolute left-1/2 top-3 z-40 -translate-x-1/2 lg:hidden">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMobileTitle((current) => !current)}
            aria-expanded={showMobileTitle}
            aria-label="Show conversation title"
            className="group flex max-w-[calc(100vw-6rem)] items-center gap-1.5 rounded-lg px-2 py-1 text-[#edf5fc] transition hover:bg-[#161a1a]"
          >
            <span className="truncate text-xs font-medium sm:max-w-70">
              {title}
            </span>

            {showMobileTitle ? (
              <ChevronUp className="h-3.5 w-3.5 shrink-0 text-[#697171]" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#697171]" />
            )}
          </button>

          {showMobileTitle && (
            <div className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2">
              <div className="rounded-xl border border-[#303737] bg-[#111515]/95 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#697171]">
                  Conversation
                </p>

                <p className="mt-1.5 truncate text-sm font-medium text-[#edf5fc]">
                  {title}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conversation */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="scrollbar-hide min-h-0 flex-1 overflow-y-auto"
      >
        <div className="mx-auto w-full max-w-3xl px-4 pb-48 pt-5 sm:px-6 sm:pt-8">
          {isLoadingConversation ? (
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="flex items-center gap-2.5 text-xs text-[#697171]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#23ce6b]" />

                <span>Loading conversation</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex min-h-[55vh] flex-col items-center justify-center px-4 text-center">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#303737] bg-[#111515]">
                <NexusAvatar size="sm" />
              </div>

              <h2 className="text-base font-medium text-[#edf5fc]">
                How can I help?
              </h2>

              <p className="mt-2 max-w-sm text-xs leading-5 text-[#697171]">
                Ask a question, explore an idea, or give NEXUS something to work
                on.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((message) => {
                const isEmptyAssistant =
                  message.role === "assistant" && !message.content.trim();

                if (isEmptyAssistant && !isGenerating) {
                  return null;
                }

                return (
                  <div key={message.id}>
                    {isEmptyAssistant && isGenerating ? (
                      <div className="flex gap-3">
                        <div className="mt-0.5 shrink-0">
                          <NexusAvatar size="sm" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex min-h-8 items-center gap-2">
                            {status && (
                              <>
                                <span className="text-[#697171]">
                                  {getStatusIcon(status.type)}
                                </span>

                                <span className="nexus-shimmer text-xs font-medium">
                                  {status.message}
                                </span>

                                <span className="flex items-center gap-0.5">
                                  <span className="nexus-dot h-1 w-1 rounded-full bg-[#697171]" />
                                  <span className="nexus-dot nexus-dot-2 h-1 w-1 rounded-full bg-[#697171]" />
                                  <span className="nexus-dot nexus-dot-3 h-1 w-1 rounded-full bg-[#697171]" />
                                </span>
                              </>
                            )}
                          </div>

                          <div className="mt-2 h-px w-20 overflow-hidden rounded-full bg-[#303737]">
                            <div className="nexus-progress h-full w-full origin-left bg-[#23ce6b]/50" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <MessageBubble message={message} />
                    )}
                  </div>
                );
              })}

              {/* Generation status after streaming has started */}
              {isGenerating &&
                messages.some(
                  (message) =>
                    message.role === "assistant" &&
                    Boolean(message.content.trim()),
                ) &&
                status && (
                  <div className="flex items-center gap-2 pl-10">
                    <span className="text-[#697171]">
                      {getStatusIcon(status.type)}
                    </span>

                    <span className="nexus-shimmer text-xs font-medium">
                      {status.message}
                    </span>

                    <span className="flex items-center gap-0.5">
                      <span className="nexus-dot h-1 w-1 rounded-full bg-[#697171]" />
                      <span className="nexus-dot nexus-dot-2 h-1 w-1 rounded-full bg-[#697171]" />
                      <span className="nexus-dot nexus-dot-3 h-1 w-1 rounded-full bg-[#697171]" />
                    </span>
                  </div>
                )}

              {/* Completed workflow nodes */}
              {completedNodes.length > 0 && !isGenerating && (
                <div className="ml-10 space-y-1">
                  {completedNodes.slice(-3).map((node) => (
                    <div
                      key={node}
                      className="flex items-center gap-2 text-[10px] text-[#697171]"
                    >
                      <Check className="h-3 w-3 text-[#23ce6b]/70" />

                      <span>{formatNodeName(node)} completed</span>
                    </div>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="absolute inset-x-0 bottom-32 z-40 px-4 sm:bottom-36">
          <div className="mx-auto flex w-full max-w-3xl items-start gap-3 rounded-xl border border-[#414949] bg-[#111515]/95 p-3 shadow-xl shadow-black/20 backdrop-blur-xl">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[#edf5fc]">
                Something went wrong
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#697171]">
                {errorMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={dismissError}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#697171] transition hover:bg-[#161a1a] hover:text-[#edf5fc]"
              aria-label="Dismiss error"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-linear-to-t from-[#0b0d0d] via-[#0b0d0d] to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-5">
        <div className="pointer-events-auto mx-auto w-full max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-2xl border border-[#303737] bg-[#111515]/95 shadow-2xl shadow-black/20 backdrop-blur-xl transition focus-within:border-[#414949]"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              disabled={isGenerating || isLoadingConversation}
              rows={1}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder={
                isLoadingConversation
                  ? "Loading conversation..."
                  : isGenerating
                    ? "NEXUS is generating..."
                    : "Message NEXUS..."
              }
              className="block max-h-48 min-h-14 w-full resize-none overflow-y-auto bg-transparent px-4 pb-14 pt-4 text-sm leading-6 text-[#edf5fc] outline-none placeholder:text-[#697171] disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-between px-2.5">
              <div className="flex min-w-0 items-center gap-1">
                <button
                  type="button"
                  disabled={isGenerating || isLoadingConversation}
                  className="flex h-8 items-center gap-2 rounded-lg px-2 text-xs text-[#697171] transition hover:bg-[#161a1a] hover:text-[#edf5fc] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Sparkles className="h-3.5 w-3.5" />

                  <span className="hidden sm:inline">NEXUS</span>
                </button>

                <span className="hidden text-[10px] text-[#414949] sm:inline">
                  Shift + Enter for new line
                </span>
              </div>

              <div className="flex items-center gap-2">
                {input.length > 0 && (
                  <span className="hidden text-[10px] tabular-nums text-[#414949] sm:inline">
                    {input.length.toLocaleString()}/
                    {MAX_MESSAGE_LENGTH.toLocaleString()}
                  </span>
                )}

                {isGenerating ? (
                  <button
                    type="button"
                    onClick={handleStopGeneration}
                    aria-label="Stop generating"
                    title="Stop generating"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#303737] bg-[#161a1a] text-[#edf5fc] transition hover:border-[#414949] hover:bg-[#1c2121]"
                  >
                    <CircleStop className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoadingConversation}
                    aria-label="Send message"
                    title="Send message"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#23ce6b] text-[#0b0d0d] transition hover:bg-[#32db79] disabled:cursor-not-allowed disabled:bg-[#303737] disabled:text-[#697171]"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="mt-2 flex min-h-4 items-center justify-center gap-2 px-2 text-center">
            <span className="text-[10px] leading-4 text-[#414949]">
              NEXUS can make mistakes. Verify important information.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
