import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customInstance } from '@/lib/axios';

/**
 * Message entity from API
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * Conversation entity with related data
 */
export interface Conversation {
  id: string;
  jobId: string;
  job: {
    id: string;
    title: string;
    serviceRequest: {
      vehicle: {
        make: string;
        model: string;
        year: number;
      };
    };
  };
  owner: {
    id: string;
    name: string;
    email: string;
  };
  provider: {
    id: string;
    businessName: string;
    email: string;
  };
  messages: Message[];
  unreadCount: number;
  lastMessageAt: string;
}

/**
 * Query keys for messages feature
 */
export const messagesKeys = {
  all: ['messages'] as const,
  conversations: () => [...messagesKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...messagesKeys.conversations(), id] as const,
  messages: (conversationId: string) => [...messagesKeys.all, 'messages', conversationId] as const,
};

/**
 * Fetch all conversations for the current user
 */
export const useConversations = () => {
  return useQuery({
    queryKey: messagesKeys.conversations(),
    queryFn: () => customInstance<Conversation[]>({
      url: '/messages/conversations',
      method: 'GET',
    }),
  });
};

/**
 * Fetch messages for a specific conversation
 */
export const useConversationMessages = (conversationId: string | null) => {
  return useQuery({
    queryKey: messagesKeys.messages(conversationId || ''),
    queryFn: () => customInstance<Message[]>({
      url: `/messages/conversations/${conversationId}`,
      method: 'GET',
    }),
    enabled: !!conversationId,
  });
};

/**
 * Send a new message
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, content }: { jobId: string; content: string }) =>
      customInstance<Message>({
        url: '/messages',
        method: 'POST',
        data: { jobId, content },
      }),
    onSuccess: (message) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({ 
        queryKey: messagesKeys.messages(message.conversationId) 
      });
      // Invalidate conversations to update last message
      queryClient.invalidateQueries({ 
        queryKey: messagesKeys.conversations() 
      });
    },
  });
};

/**
 * Mark conversation as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      customInstance({
        url: `/messages/conversations/${conversationId}/read`,
        method: 'POST',
      }),
    onSuccess: (_, conversationId) => {
      // Optimistically update conversations cache
      queryClient.setQueryData<Conversation[]>(
        messagesKeys.conversations(),
        (old) => old?.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 } 
            : conv
        )
      );
    },
  });
};
