import type { Message } from "../types/message";

/**
 * Sort messages by priority score (highest first)
 * Uses the priority field provided by the backend (0-1 scale)
 * Secondary sort by timestamp (newest first)
 */
export function sortMessagesByPriority(messages: Message[]): Message[] {
  return [...messages].sort((a, b) => {
    // Primary sort: priority score from backend (descending)
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    // Secondary sort: timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}
