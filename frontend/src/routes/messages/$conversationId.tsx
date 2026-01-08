import { createFileRoute } from '@tanstack/react-router';
import { ChatWindow } from '@/features/messages/components/ChatWindow';

export const Route = createFileRoute('/messages/$conversationId')({
  component: ConversationPage,
});

function ConversationPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <ChatWindow />
    </div>
  );
}
