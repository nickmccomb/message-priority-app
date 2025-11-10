import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMessages, markMessageAsRead, archiveMessage, deleteMessage } from '../utils/api';
import { useMessageStore } from '../stores/messageStore';
import { mergeMessages, deduplicateMessages } from '../utils/messageDeduplication';
import { sortMessagesByPriority } from '../utils/priority';
import type { Message } from '../types/message';

const MESSAGES_QUERY_KEY = ['messages'] as const;

/**
 * Hook to fetch messages using React Query
 * Syncs data to Zustand store on successful fetch
 */
export function useMessages() {
  const { setMessages, messages } = useMessageStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: async () => {
      const fetchedMessages = await fetchMessages();
      
      // Merge with existing messages and deduplicate
      const merged = mergeMessages(messages, fetchedMessages);
      
      // Sort by priority
      const sorted = sortMessagesByPriority(merged);
      
      // Update Zustand store
      setMessages(sorted);
      
      return sorted;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });

  return query;
}

/**
 * Hook to mark a message as read with optimistic updates
 */
export function useMarkAsRead() {
  const { markAsRead } = useMessageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markMessageAsRead,
    onMutate: async (messageId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: MESSAGES_QUERY_KEY });

      // Optimistically update Zustand store
      markAsRead(messageId);

      // Return context for rollback
      return { messageId };
    },
    onError: (err, messageId, context) => {
      // Rollback optimistic update on error
      if (context) {
        const { markAsUnread } = useMessageStore.getState();
        markAsUnread(context.messageId);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY });
    },
  });
}

/**
 * Hook to archive a message with optimistic updates
 */
export function useArchiveMessage() {
  const { removeMessage } = useMessageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveMessage,
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: MESSAGES_QUERY_KEY });
      
      // Store message for rollback
      const messages = useMessageStore.getState().messages;
      const message = messages.find((m) => m.id === messageId);
      
      // Optimistically remove from store
      removeMessage(messageId);

      return { message };
    },
    onError: (err, messageId, context) => {
      // Rollback on error
      if (context?.message) {
        const { addMessage } = useMessageStore.getState();
        addMessage(context.message);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY });
    },
  });
}

/**
 * Hook to delete a message with optimistic updates
 */
export function useDeleteMessage() {
  const { removeMessage } = useMessageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMessage,
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: MESSAGES_QUERY_KEY });
      
      const messages = useMessageStore.getState().messages;
      const message = messages.find((m) => m.id === messageId);
      
      removeMessage(messageId);

      return { message };
    },
    onError: (err, messageId, context) => {
      if (context?.message) {
        const { addMessage } = useMessageStore.getState();
        addMessage(context.message);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY });
    },
  });
}

