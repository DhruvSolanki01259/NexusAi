import { ChatConversationContent } from "@/components/chat/ChatConversation";

interface ChatConversationProps {
  conversationId: string;
}

export default function ChatConversation({
  conversationId,
}: ChatConversationProps) {
  return (
    <ChatConversationContent
      key={conversationId}
      conversationId={conversationId}
    />
  );
}
