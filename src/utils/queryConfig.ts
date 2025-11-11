import { fetchMessages } from "./api";
import { mergeMessages } from "./messageDeduplication";
import { sortMessagesByPriority } from "./priority";
import { useMessageStore } from "../stores/messageStore";

/**
 * Shared query function for messages
 * This is used across all message-related queries to ensure consistency
 */
export async function messagesQueryFn() {
  const { setMessages, messages } = useMessageStore.getState();
  const fetchedMessages = await fetchMessages();
  const merged = mergeMessages(messages, fetchedMessages);
  const sorted = sortMessagesByPriority(merged);
  setMessages(sorted);
  return sorted;
}

/**
 * Default query options for messages
 */
export const messagesQueryOptions = {
  staleTime: 30000, // 30 seconds
  gcTime: 5 * 60 * 1000, // 5 minutes
} as const;

