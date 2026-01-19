import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ConversationList } from '@/features/messages/components/ConversationList';
import { useEffect } from 'react';
import { useMessagesStore } from '@/lib/store';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';

export const Route = createFileRoute('/messages/')({
  component: MessagesPage,
  validateSearch: (search: Record<string, unknown>) => ({
    jobId: (search.jobId as string) || undefined,
  }),
});

function MessagesPage() {
  const { jobId } = Route.useSearch();
  const navigate = useNavigate();
  const { conversations, sendMessage, loadConversations } = useMessagesStore();

  useEffect(() => {
    if (jobId) {
      // Check if conversation already exists for this job
      loadConversations().then(() => {
        const existingConversation = conversations.find(c => c.jobId === jobId);
        if (existingConversation) {
          navigate({ to: '/messages/$conversationId', params: { conversationId: existingConversation.id } });
        } else {
          // Create first message to initiate conversation
          sendMessage(jobId, 'Hello! I wanted to discuss this job with you.').then(() => {
            loadConversations();
          });
        }
      });
    }
  }, [jobId, conversations, navigate, sendMessage, loadConversations]);

  return (
    <PageContainer maxWidth="6xl">
      <PageHeader 
        title="Messages" 
        subtitle="Communicate with service providers and vehicle owners about your jobs."
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
        <ConversationList />
      </div>
    </PageContainer>
  );
}
