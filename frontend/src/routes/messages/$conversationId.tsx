import { createFileRoute } from '@tanstack/react-router';
import { ChatWindow } from '@/features/messages/components/ChatWindow';
import { PageContainer } from '@/components/layout/PageContainer';

export const Route = createFileRoute('/messages/$conversationId')({
  component: ConversationPage,
});

function ConversationPage() {
  return (
    <PageContainer maxWidth="6xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-14rem)] min-h-[500px]">
        <ChatWindow />
      </div>
    </PageContainer>
  );
}
