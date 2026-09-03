"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Copy,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

interface ChatConversationProps {
  conversationId: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export default function ChatConversation({
  conversationId,
}: ChatConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  const conversationTitle = "New conversation";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = input.trim();

    if (!value || isGenerating) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: value,
      createdAt: "Just now",
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsGenerating(true);

    /*
        LangGraph invocation.
    */

    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "I`ve received your message. This is where the NEXUS reasoning workflow will process the request and return the generated response.",
        createdAt: "Just now",
      };

      setMessages((current) => [...current, assistantMessage]);
      setIsGenerating(false);
    }, 900);
  };

  const handleRegenerate = () => {
    if (isGenerating) return;

    // perform regeneration of response for the same query

    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
    }, 900);
  };

  return (
    <div className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#0b0d0d] text-[#edf5fc]">
      <header className="hidden h-14 shrink-0 items-center justify-center border-b border-[#303737] bg-[#0b0d0d]/95 px-5 backdrop-blur-xl lg:flex">
        <div className="min-w-0 max-w-xl text-center">
          <h1 className="truncate text-sm font-medium text-[#edf5fc]">
            {conversationTitle}
          </h1>
        </div>
      </header>

      <div className="absolute left-1/2 top-3 z-30 -translate-x-1/2 lg:hidden">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowHeader((current) => !current)}
            aria-expanded={showHeader}
            aria-label={
              showHeader ? "Hide conversation title" : "Show conversation title"
            }
            className="group flex max-w-[calc(100vw-6rem)] items-center gap-1.5 rounded-xl border border-transparent px-2.5 py-1.5 text-[#697171] transition-all duration-200 hover:border-[#303737] hover:bg-[#161a1a] hover:text-[#aeb7ba] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20"
          >
            <span className="truncate text-xs font-medium sm:max-w-70">
              {conversationTitle}
            </span>

            {showHeader ? (
              <ChevronUp size={14} strokeWidth={1.8} className="shrink-0" />
            ) : (
              <ChevronDown size={14} strokeWidth={1.8} className="shrink-0" />
            )}
          </button>

          <div
            className={`absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 origin-top transition-all duration-200 ${
              showHeader
                ? "pointer-events-auto scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            }`}
          >
            <div className="rounded-xl border border-[#303737] bg-[#111515]/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#5f6666]">
                Conversation
              </p>

              <p className="mt-1.5 truncate text-sm font-medium text-[#edf5fc]">
                {conversationTitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 pb-40 pt-5 sm:px-6 sm:pt-6 lg:max-w-4xl lg:pt-8">
          <div className="space-y-8">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onRegenerate={
                  message.role === "assistant" &&
                  message.id === messages[messages.length - 1]?.id
                    ? handleRegenerate
                    : undefined
                }
              />
            ))}

            {isGenerating && (
              <div className="flex items-start gap-4">
                <NexusAvatar />

                <div className="flex items-center gap-2 pt-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#23ce6b]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#23ce6b] [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#23ce6b] [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-[#0b0d0d] via-[#0b0d0d]/95 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4 sm:pt-12">
        <div className="pointer-events-auto mx-auto w-full max-w-3xl lg:max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-2xl border border-[#414949] bg-[#161a1a] shadow-[0_12px_50px_rgba(0,0,0,0.35)] transition-colors focus-within:border-[#596262]"
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();

                  if (input.trim()) {
                    event.currentTarget.form?.requestSubmit();
                  }
                }
              }}
              placeholder="Message NEXUS..."
              rows={1}
              className="block max-h-48 min-h-14 w-full resize-none bg-transparent px-4 pb-14 pt-4 pr-14 text-sm leading-6 text-[#edf5fc] outline-none placeholder:text-[#697171]"
            />

            <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-between px-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="flex h-8 items-center gap-2 rounded-lg px-2 text-xs text-[#697171] transition-colors hover:bg-[#303737] hover:text-[#aeb7ba]"
                >
                  <Sparkles size={15} strokeWidth={1.8} />
                  <span className="hidden sm:inline">NEXUS</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={!input.trim() || isGenerating}
                aria-label="Send message"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#23ce6b] text-[#0b0d0d] transition-all duration-200 hover:bg-[#32dc79] disabled:cursor-not-allowed disabled:bg-[#303737] disabled:text-[#697171]"
              >
                <ArrowUp size={17} strokeWidth={2.4} />
              </button>
            </div>
          </form>

          <p className="mt-2 text-center text-[10px] text-[#5f6666]">
            NEXUS can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  onRegenerate?: () => void;
}

function MessageBubble({ message, onRegenerate }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%]">
          <div className="rounded-2xl bg-[#303737] px-4 py-3 text-sm leading-6 text-[#edf5fc]">
            {message.content}
          </div>

          {message.createdAt && (
            <p className="mt-1.5 text-right text-[10px] text-[#5f6666]">
              {message.createdAt}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <NexusAvatar />

      <div className="min-w-0 flex-1">
        <div className="max-w-none text-sm leading-7 text-[#aeb7ba]">
          <MessageContent content={message.content} />
        </div>

        <div className="mt-3 flex items-center gap-1">
          <MessageAction
            icon={Copy}
            label="Copy"
            onClick={() => navigator.clipboard?.writeText(message.content)}
          />

          <MessageAction icon={ThumbsUp} label="Good response" />
          <MessageAction icon={ThumbsDown} label="Bad response" />

          {onRegenerate && (
            <MessageAction
              icon={RefreshCw}
              label="Regenerate"
              onClick={onRegenerate}
            />
          )}
        </div>

        {message.createdAt && (
          <p className="mt-1 text-[10px] text-[#5f6666]">{message.createdAt}</p>
        )}
      </div>
    </div>
  );
}

function NexusAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#23ce6b] text-xs font-bold text-[#0b0d0d] shadow-[0_0_20px_rgba(35,206,107,0.08)]">
      N
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const paragraphs = content.split("\n\n");

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => {
        if (paragraph.startsWith("- ")) {
          const items = paragraph
            .split("\n")
            .filter(Boolean)
            .map((item) => item.replace(/^-\s*/, ""));

          return (
            <ul key={index} className="list-disc space-y-1.5 pl-5">
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInlineFormatting(item)}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{renderInlineFormatting(paragraph)}</p>;
      })}
    </div>
  );
}

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-[#edf5fc]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

interface MessageActionProps {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  label: string;
  onClick?: () => void;
}

function MessageAction({ icon: Icon, label, onClick }: MessageActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5f6666] transition-colors hover:bg-[#161a1a] hover:text-[#aeb7ba]"
    >
      <Icon size={15} strokeWidth={1.8} />
    </button>
  );
}
