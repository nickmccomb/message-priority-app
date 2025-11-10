import type { Message } from "../types/message";

/**
 * Deduplicate messages by ID
 * Keeps the most recent version if duplicates exist
 */
export function deduplicateMessages(messages: Message[]): Message[] {
  const messageMap = new Map<string, Message>();

  // Process messages in order, keeping the most recent version
  for (const message of messages) {
    const existing = messageMap.get(message.id);
    if (
      !existing ||
      new Date(message.timestamp) > new Date(existing.timestamp)
    ) {
      messageMap.set(message.id, message);
    }
  }

  return Array.from(messageMap.values());
}

/**
 * Merge new messages with existing messages, deduplicating by ID
 * Returns merged array sorted by priority
 */
export function mergeMessages(
  existing: Message[],
  newMessages: Message[]
): Message[] {
  const allMessages = [...existing, ...newMessages];
  return deduplicateMessages(allMessages);
}
