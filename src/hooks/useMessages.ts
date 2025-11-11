import { archiveMessage, deleteMessage, markMessageAsRead } from "../utils/api";
import { messagesQueryFn, messagesQueryOptions } from "../utils/queryConfig";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useMessageStore } from "../stores/messageStore";

const MESSAGES_QUERY_KEY = ["messages"] as const;

/**
 * Hook to fetch messages using React Query
 * Syncs data to Zustand store on successful fetch
 */
export function useMessages() {
  return useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: messagesQueryFn,
    ...messagesQueryOptions,
  });
}

/**
 * Hook to get only the loading state
 * React Query deduplicates queries with the same key, so this is efficient
 * Only re-renders when isLoading changes
 */
export function useMessagesLoading() {
  const query = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: messagesQueryFn,
    ...messagesQueryOptions,
  });

  return query.isLoading;
}

/**
 * Hook to get only the error state
 * Only re-renders when isError changes
 */
export function useMessagesError() {
  const query = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: messagesQueryFn,
    ...messagesQueryOptions,
  });

  return query.isError;
}

/**
 * Hook to get only the refetch function
 * Refetch function is stable, so this won't cause unnecessary re-renders
 */
export function useMessagesRefetch() {
  const query = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: messagesQueryFn,
    ...messagesQueryOptions,
  });

  return query.refetch;
}

/**
 * Hook to get only the isRefetching state
 * Only re-renders when isRefetching changes
 */
export function useMessagesIsRefetching() {
  const query = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: messagesQueryFn,
    ...messagesQueryOptions,
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
