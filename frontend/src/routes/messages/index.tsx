import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ConversationList } from '@/features/messages/components/ConversationList';
import { MessageSquare } from 'lucide-react';
import { useEffect } from 'react';
import { useMessagesStore } from '@/features/messages/hooks/useMessagesStore';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        </div>
        <p className="text-gray-600">
          Communicate with service providers and vehicle owners about your jobs.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ConversationList />
      </div>
    </div>
  );
}
