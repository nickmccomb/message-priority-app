import type { FilterMode } from "../types/filter";
import type { Message } from "../types/message";

/**
 * Sort messages by priority score (highest first)
 * Uses the priority field provided by the backend (0-1 scale)
 * Secondary sort by timestamp (newest first)
 */
export function sortMessagesByPriority(messages: Message[]): Message[] {
  return sortMessages(messages, "both");
}

/**
 * Sort messages based on filter mode
 * @param messages - Array of messages to sort
 * @param mode - Filter mode: "both" (priority + time), "priority", or "time"
 */
export function sortMessages(
  messages: Message[],
  mode: FilterMode = "both"
): Message[] {
  return [...messages].sort((a, b) => {
    if (mode === "priority") {
      // Sort by priority only (descending)
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      // Secondary sort by timestamp for ties
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }

    if (mode === "time") {
      // Sort by timestamp only (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }

    // mode === "both" - Combine priority and recency for relevance score
    // Weight priority more heavily (70%) but also consider recency (30%)
    const now = Date.now();
    const aAge = now - new Date(a.timestamp).getTime();
    const bAge = now - new Date(b.timestamp).getTime();

    // Normalize age to 0-1 scale (newer = higher score)
    // Messages older than 7 days get 0, messages from now get 1
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const aRecency = Math.max(0, 1 - aAge / sevenDaysMs);
    const bRecency = Math.max(0, 1 - bAge / sevenDaysMs);

    // Combined relevance score: 70% priority + 30% recency
    const aRelevance = a.priority * 0.7 + aRecency * 0.3;
    const bRelevance = b.priority * 0.7 + bRecency * 0.3;

    if (bRelevance !== aRelevance) {
      return bRelevance - aRelevance;
    }

    // Tie-breaker: newest first
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}
