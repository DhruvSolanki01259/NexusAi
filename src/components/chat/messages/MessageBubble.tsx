"use client";

import { Copy } from "lucide-react";

import { NexusAvatar } from "../NexusAvatar";
import { MessageAction } from "./MessageAction";
import { MessageContent } from "./MessageContent";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%]">
          <div className="wrap-break-word rounded-2xl bg-[#303737] px-4 py-3 text-sm leading-6 text-[#edf5fc]">
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
      <div className="shrink-0">
        <NexusAvatar />
      </div>

      <div className="min-w-0 flex-1">
        <div className="max-w-none text-sm leading-7 text-[#aeb7ba]">
          <MessageContent content={message.content} />
        </div>

        <div className="mt-3 flex items-center">
          <MessageAction
            icon={Copy}
            label="Copy"
            onClick={() => navigator.clipboard?.writeText(message.content)}
          />
        </div>

        {message.createdAt && (
          <p className="mt-1 text-[10px] text-[#5f6666]">{message.createdAt}</p>
        )}
      </div>
    </div>
  );
}
