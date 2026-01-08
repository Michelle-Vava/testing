import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
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

interface MessagesStore {
  socket: Socket | null;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isTyping: boolean;
  connect: (userId: string, token: string) => void;
  disconnect: () => void;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (jobId: string, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  setActiveConversation: (conversation: Conversation | null) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useMessagesStore = create<MessagesStore>((set, get) => ({
  socket: null,
  conversations: [],
  activeConversation: null,
  messages: [],
  isTyping: false,

  connect: (userId: string, token: string) => {
    const socket = io(`${API_URL}/messages`, {
      query: { userId },
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('Connected to messages gateway');
    });

    socket.on('newMessage', (message: Message) => {
      const { activeConversation, messages } = get();
      
      // Add to messages if it's for the active conversation
      if (activeConversation?.id === message.conversationId) {
        set({ messages: [...messages, message] });
        
        // Auto-mark as read if conversation is active
        get().markAsRead(message.conversationId);
      }
      
      // Update conversation list
      get().loadConversations();
    });

    socket.on('userTyping', ({ userId: typingUserId, isTyping }) => {
      const { activeConversation } = get();
      if (activeConversation) {
        const otherUserId = activeConversation.owner.id === typingUserId 
          ? activeConversation.owner.id 
          : activeConversation.provider.id;
        
        if (typingUserId === otherUserId) {
          set({ isTyping });
        }
      }
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  loadConversations: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const conversations = await response.json();
        set({ conversations });
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  },

  loadMessages: async (conversationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const messages = await response.json();
        set({ messages });
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  },

  sendMessage: async (jobId: string, content: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId, content }),
      });
      
      if (response.ok) {
        const message = await response.json();
        const { messages } = get();
        set({ messages: [...messages, message] });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  },

  markAsRead: async (conversationId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/messages/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Update local state
      const { conversations } = get();
      set({
        conversations: conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        ),
      });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },

  setActiveConversation: (conversation: Conversation | null) => {
    const { activeConversation, leaveConversation } = get();
    
    // Leave old conversation
    if (activeConversation) {
      leaveConversation(activeConversation.id);
    }
    
    set({ activeConversation, messages: [] });
    
    // Join new conversation
    if (conversation) {
      get().joinConversation(conversation.id);
      get().loadMessages(conversation.id);
      get().markAsRead(conversation.id);
    }
  },

  joinConversation: (conversationId: string) => {
    const { socket } = get();
    socket?.emit('joinConversation', { conversationId });
  },

  leaveConversation: (conversationId: string) => {
    const { socket } = get();
    socket?.emit('leaveConversation', { conversationId });
  },
}));
