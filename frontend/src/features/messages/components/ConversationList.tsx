import { useEffect } from 'react';
import { useMessagesStore } from '../hooks/useMessagesStore';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Car } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function ConversationList() {
  const { user } = useAuth();
  const { conversations, loadConversations, setActiveConversation, connect, disconnect } = useMessagesStore();

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      if (token) {
        connect(user.id, token);
        loadConversations();
      }
    }

    return () => {
      disconnect();
    };
  }, [user, connect, disconnect, loadConversations]);

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No messages yet</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          Start a conversation with a service provider or vehicle owner from a job.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => {
        const isOwner = user?.id === conversation.owner.id;
        const otherParty = isOwner ? conversation.provider : conversation.owner;
        const lastMessage = conversation.messages[conversation.messages.length - 1];

        return (
          <Link
            key={conversation.id}
            to="/messages/$conversationId"
            params={{ conversationId: conversation.id }}
            onClick={() => setActiveConversation(conversation)}
            className="block hover:bg-gray-50 transition-colors"
          >
            <div className="px-6 py-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Car className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.job.serviceRequest.vehicle.year}{' '}
                      {conversation.job.serviceRequest.vehicle.make}{' '}
                      {conversation.job.serviceRequest.vehicle.model}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {isOwner ? otherParty.businessName : otherParty.name}
                  </p>
                </div>
                <div className="flex flex-col items-end ml-4 flex-shrink-0">
                  {conversation.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full mb-1">
                      {conversation.unreadCount}
                    </span>
                  )}
                  {lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
              {lastMessage && (
                <p className="text-sm text-gray-500 truncate">
                  {lastMessage.senderId === user?.id ? 'You: ' : ''}
                  {lastMessage.content}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
