import {
  archiveMessage,
  deleteMessage,
  fetchMessages,
  markMessageAsRead,
} from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { mergeMessages } from "../utils/messageDeduplication";
import { sortMessagesByPriority } from "../utils/priority";
import { useMessageStore } from "../stores/messageStore";

const MESSAGES_QUERY_KEY = ["messages"] as const;

/**
 * Hook to fetch messages using React Query
 * Syncs data to Zustand store on successful fetch
 */
export function useMessages() {
  const { setMessages, messages } = useMessageStore();

  return useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: async () => {
      const fetchedMessages = await fetchMessages();
      const merged = mergeMessages(messages, fetchedMessages);
      const sorted = sortMessagesByPriority(merged);
      setMessages(sorted);
      return sorted;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });
}

/**
 * Hook to get only the loading state
 * React Query deduplicates queries with the same key, so this is efficient
 * Only re-renders when isLoading changes
 */
export function useMessagesLoading() {
  const { setMessages, messages } = useMessageStore();

  const query = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: async () => {
      const fetchedMessages = await fetchMessages();
      const merged = mergeMessages(messages, fetchedMessages);
      const sorted = sortMessagesByPriority(merged);
      setMessages(sorted);
      return sorted;
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  return query.isLoading;
}

/**
 * Hook to get only the error state
 * Only re-renders when isError changes
 */
export function useMessagesError() {
  const { setMessages, messages } = useMessageStore();

  const query = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: async () => {
      const fetchedMessages = await fetchMessages();
      const merged = mergeMessages(messages, fetchedMessages);
      const sorted = sortMessagesByPriority(merged);
      setMessages(sorted);
      return sorted;
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  return query.isError;
}

/**
 * Hook to get only the refetch function
 * Refetch function is stable, so this won't cause unnecessary re-renders
 */
export function useMessagesRefetch() {
  const { setMessages, messages } = useMessageStore();

  const query = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: async () => {
      const fetchedMessages = await fetchMessages();
      const merged = mergeMessages(messages, fetchedMessages);
      const sorted = sortMessagesByPriority(merged);
      setMessages(sorted);
      return sorted;
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  return query.refetch;
}

/**
 * Hook to get only the isRefetching state
 * Only re-renders when isRefetching changes
 */
export function useMessagesIsRefetching() {
  const { setMessages, messages } = useMessageStore();

  const query = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: async () => {
      const fetchedMessages = await fetchMessages();
      const merged = mergeMessages(messages, fetchedMessages);
      const sorted = sortMessagesByPriority(merged);
      setMessages(sorted);
      return sorted;
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  return query.isRefetching;
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
