import { useEffect } from 'react';
import { useMessagesStore, useMessagesUIStore } from '@/lib/store';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useToken } from '@/lib/hooks';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Car } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export function ConversationList() {
  const { user } = useAuth();
  const token = useToken();
  const navigate = useNavigate();
  const { conversations, loadConversations } = useMessagesStore();
  const { setActiveConversation } = useMessagesUIStore();

  useEffect(() => {
    if (user && token) {
      loadConversations();
    }
  }, [user, token, loadConversations]);

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No messages yet</h3>
        <p className="text-slate-600 mb-6">
          Messages unlock after you accept a quote. Start by browsing providers or viewing your requests.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button 
            onClick={() => navigate({ to: '/owner/requests' })}
            className="flex-1"
          >
            View My Requests
          </Button>
          <Button 
            onClick={() => navigate({ to: '/owner/providers' })}
            variant="outline"
            className="flex-1"
          >
            Browse Providers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => {
        const isOwner = user?.id === conversation.owner.id;
        const otherParty = isOwner ? conversation.provider : conversation.owner;
        const lastMessage = conversation.messages?.[conversation.messages.length - 1];

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
