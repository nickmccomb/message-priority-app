import { sortMessages, sortMessagesByPriority } from '../priority';
import type { Message } from '../../types/message';
import type { FilterMode } from '../../types/filter';

describe('priority utilities', () => {
  const createMessage = (
    id: string,
    priority: number,
    timestamp: string,
    isRead = false
  ): Message => ({
    id,
    source: 'email',
    sender: 'Test Sender',
    subject: 'Test Subject',
    preview: 'Test preview',
    timestamp,
    priority,
    isRead,
    isUrgent: priority > 0.7,
    senderVIP: false,
  });

  describe('sortMessagesByPriority', () => {
    it('should sort messages by priority (highest first)', () => {
      const messages: Message[] = [
        createMessage('1', 0.3, '2024-01-01T10:00:00Z'),
        createMessage('2', 0.9, '2024-01-01T09:00:00Z'),
        createMessage('3', 0.5, '2024-01-01T11:00:00Z'),
      ];

      const sorted = sortMessagesByPriority(messages);

      expect(sorted[0].id).toBe('2'); // Highest priority
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });
  });

  describe('sortMessages', () => {
    describe('mode: "priority"', () => {
      it('should sort by priority only (descending)', () => {
        const messages: Message[] = [
          createMessage('1', 0.2, '2024-01-01T10:00:00Z'),
          createMessage('2', 0.8, '2024-01-01T09:00:00Z'),
          createMessage('3', 0.5, '2024-01-01T11:00:00Z'),
        ];

        const sorted = sortMessages(messages, 'priority');

        expect(sorted[0].priority).toBe(0.8);
        expect(sorted[1].priority).toBe(0.5);
        expect(sorted[2].priority).toBe(0.2);
      });

      it('should use timestamp as tie-breaker for same priority', () => {
        const messages: Message[] = [
          createMessage('1', 0.5, '2024-01-01T09:00:00Z'),
          createMessage('2', 0.5, '2024-01-01T11:00:00Z'),
          createMessage('3', 0.5, '2024-01-01T10:00:00Z'),
        ];

        const sorted = sortMessages(messages, 'priority');

        // Should be sorted by timestamp (newest first) when priority is equal
        expect(sorted[0].id).toBe('2'); // Newest
        expect(sorted[1].id).toBe('3');
        expect(sorted[2].id).toBe('1'); // Oldest
      });
    });

    describe('mode: "time"', () => {
      it('should sort by timestamp only (newest first)', () => {
        const messages: Message[] = [
          createMessage('1', 0.9, '2024-01-01T09:00:00Z'),
          createMessage('2', 0.2, '2024-01-01T11:00:00Z'),
          createMessage('3', 0.5, '2024-01-01T10:00:00Z'),
        ];

        const sorted = sortMessages(messages, 'time');

        expect(sorted[0].id).toBe('2'); // Newest
        expect(sorted[1].id).toBe('3');
        expect(sorted[2].id).toBe('1'); // Oldest
      });
    });

    describe('mode: "both"', () => {
      it('should combine priority and recency for relevance score', () => {
        const now = new Date('2024-01-01T12:00:00Z');
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

        const messages: Message[] = [
          createMessage('1', 0.5, oneDayAgo), // Lower priority, older
          createMessage('2', 0.8, oneHourAgo), // Higher priority, newer
          createMessage('3', 0.6, oneHourAgo), // Medium priority, newer
        ];

        const sorted = sortMessages(messages, 'both');

        // Message 2 should be first (high priority + recent)
        expect(sorted[0].id).toBe('2');
        // Message 3 should be second (medium priority + recent)
        expect(sorted[1].id).toBe('3');
        // Message 1 should be last (lower priority + older)
        expect(sorted[2].id).toBe('1');
      });

      it('should prioritize high priority even if older', () => {
        const now = new Date('2024-01-01T12:00:00Z');
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

        const messages: Message[] = [
          createMessage('1', 0.9, oneDayAgo), // Very high priority, older
          createMessage('2', 0.3, oneHourAgo), // Low priority, newer
        ];

        const sorted = sortMessages(messages, 'both');

        // High priority should win even if older
        expect(sorted[0].id).toBe('1');
        expect(sorted[1].id).toBe('2');
      });

      it('should handle messages older than 7 days', () => {
        const now = new Date('2024-01-01T12:00:00Z');
        const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

        const messages: Message[] = [
          createMessage('1', 0.5, eightDaysAgo), // Old message (recency = 0)
          createMessage('2', 0.5, oneHourAgo), // Recent message
        ];

        const sorted = sortMessages(messages, 'both');

        // Recent message should be first even with same priority
        expect(sorted[0].id).toBe('2');
        expect(sorted[1].id).toBe('1');
      });
    });

    it('should not mutate the original array', () => {
      const messages: Message[] = [
        createMessage('1', 0.5, '2024-01-01T10:00:00Z'),
        createMessage('2', 0.8, '2024-01-01T09:00:00Z'),
      ];

      const original = [...messages];
      sortMessages(messages, 'priority');

      expect(messages).toEqual(original);
    });

    it('should handle empty array', () => {
      expect(sortMessages([], 'both')).toEqual([]);
      expect(sortMessages([], 'priority')).toEqual([]);
      expect(sortMessages([], 'time')).toEqual([]);
    });

    it('should handle single message', () => {
      const messages = [createMessage('1', 0.5, '2024-01-01T10:00:00Z')];
      const sorted = sortMessages(messages, 'both');

      expect(sorted).toHaveLength(1);
      expect(sorted[0].id).toBe('1');
    });
  });
});

