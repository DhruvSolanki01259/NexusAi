import ChatConversation from "@/components/chat/ChatConversation";

interface ConversationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { id } = await params;
  // console.log(id);

  return <ChatConversation conversationId={id} />;
}
