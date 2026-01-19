import { create } from 'zustand';

/**
 * Conversation reference for UI state
 */
interface ConversationRef {
  id: string;
  jobId: string;
}

/**
 * Messages UI state (data fetching is handled by React Query)
 * 
 * This store only manages:
 * - Active conversation selection
 * - Typing indicators (real-time UI state)
 * 
 * @see use-messages.ts for data fetching hooks
 */
interface MessagesUIState {
  /** Currently selected conversation */
  activeConversationId: string | null;
  /** Whether remote user is typing */
  isRemoteTyping: boolean;
  /** Whether current user is typing */
  isLocalTyping: boolean;
  
  /** Select a conversation */
  setActiveConversation: (conversationId: string | null) => void;
  /** Update remote typing indicator (from socket) */
  setRemoteTyping: (isTyping: boolean) => void;
  /** Update local typing indicator */
  setLocalTyping: (isTyping: boolean) => void;
}

/**
 * UI state for messages feature
 * Data fetching is handled by React Query hooks in use-messages.ts
 */
export const useMessagesUIStore = create<MessagesUIState>((set) => ({
  activeConversationId: null,
  isRemoteTyping: false,
  isLocalTyping: false,

  setActiveConversation: (conversationId: string | null) => {
    set({ activeConversationId: conversationId, isRemoteTyping: false });
  },

  setRemoteTyping: (isTyping: boolean) => {
    set({ isRemoteTyping: isTyping });
  },

  setLocalTyping: (isTyping: boolean) => {
    set({ isLocalTyping: isTyping });
  },
}));

// Re-export for backwards compatibility during migration
export { useMessagesUIStore as useMessagesStore };
