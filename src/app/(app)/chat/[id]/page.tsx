import { ChatConversationContent } from "@/components/chat/ChatConversation";

export default async function ChatConversation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // console.log("conversationId:", id);

  return (
    <ChatConversationContent
      key={id}
      conversationId={id}
    />
  );
}