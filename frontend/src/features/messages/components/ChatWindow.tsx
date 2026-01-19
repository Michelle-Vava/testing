import React, { useState, useEffect, useRef } from 'react';
import { useMessagesUIStore } from '@/lib/store';
import { useConversations, useConversationMessages, useSendMessage, useMarkAsRead } from '../hooks/use-messages';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { format } from 'date-fns';
import { Send, ArrowLeft } from 'lucide-react';
import { Link, useParams } from '@tanstack/react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import { LoadingState } from '@/components/ui/loading-state';

/**
 * Real-time chat window with virtual scrolling and React Query integration
 * 
 * LAYOUT:
 * ┌─────────────────────────────────────┐
 * │ HEADER (fixed top)                  │
 * │ ← Back | Provider Name              │
 * │         Vehicle: 2020 Honda Civic   │
 * ├─────────────────────────────────────┤
 * │                                     │
 * │ MESSAGES (virtualized scroll)       │
 * │  ┌────────────┐                     │
 * │  │ Their msg  │                     │
 * │  └────────────┘                     │
 * │              ┌────────────┐         │
 * │              │ Your msg   │         │
 * │              └────────────┘         │
 * │                                     │
 * ├─────────────────────────────────────┤
 * │ INPUT (fixed bottom)                │
 * │ Type message... [Send]              │
 * └─────────────────────────────────────┘
 */
export function ChatWindow() {
  const { conversationId } = useParams({ from: '/messages/$conversationId' });
  const { user } = useAuth();
  
  // UI state from Zustand
  const { isRemoteTyping, setActiveConversation } = useMessagesUIStore();
  
  // Data from React Query
  const { data: conversations = [] } = useConversations();
  const { data: messages = [], isLoading: isLoadingMessages } = useConversationMessages(conversationId);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();

  const [messageText, setMessageText] = useState('');
  const parentRef = useRef<HTMLDivElement>(null);

  // Find active conversation from cache
  const activeConversation = conversations.find(c => c.id === conversationId);

  // Set active conversation in UI store and mark as read
  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
      markAsReadMutation.mutate(conversationId);
    }
    return () => setActiveConversation(null);
  }, [conversationId, setActiveConversation]);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      rowVirtualizer.scrollToIndex(messages.length - 1);
    }
  }, [messages, rowVirtualizer]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    await sendMessageMutation.mutateAsync({ 
      jobId: activeConversation.jobId, 
      content: messageText 
    });
    setMessageText('');
  };

  if (!activeConversation && !isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a conversation to start messaging</p>
      </div>
    );
  }

  if (isLoadingMessages) {
    return <LoadingState message="Loading messages..." />;
  }

  const isOwner = user?.id === activeConversation?.owner.id;
  const otherParty = isOwner ? activeConversation?.provider : activeConversation?.owner;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/messages"
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {isOwner ? otherParty?.businessName : otherParty?.name}
            </h2>
            <p className="text-sm text-gray-500 truncate">
              {activeConversation?.job.serviceRequest.vehicle.year}{' '}
              {activeConversation?.job.serviceRequest.vehicle.make}{' '}
              {activeConversation?.job.serviceRequest.vehicle.model}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const message = messages[virtualRow.index];
            const isOwnMessage = message.senderId === user?.id;

            return (
              <div
                key={message.id}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} pb-4`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {format(new Date(message.createdAt), 'h:mm a')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {isRemoteTyping && (
          <div className="flex justify-start pt-4">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
