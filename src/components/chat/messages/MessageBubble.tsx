import { NexusAvatar } from "../NexusAvatar";
import { MessageAction } from "./MessageAction";
import { MessageContent } from "./MessageContent";
import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

interface MessageBubbleProps {
  message: Message;
  onRegenerate?: () => void;
}

export function MessageBubble({ message, onRegenerate }: MessageBubbleProps) {
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
