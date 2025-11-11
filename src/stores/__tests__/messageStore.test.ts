import { act, renderHook } from '@testing-library/react-native';
import { useMessageStore } from '../messageStore';
import type { Message } from '../../types/message';

describe('messageStore', () => {
  const createMessage = (id: string, priority = 0.5): Message => ({
    id,
    source: 'email',
    sender: 'Test Sender',
    subject: 'Test Subject',
    preview: 'Test preview',
    timestamp: '2024-01-01T10:00:00Z',
    priority,
    isRead: false,
    isUrgent: false,
    senderVIP: false,
  });

  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useMessageStore());
    act(() => {
      result.current.clearMessages();
    });
  });

  describe('setMessages', () => {
    it('should set messages', () => {
      const { result } = renderHook(() => useMessageStore());
      const messages = [
        createMessage('1'),
        createMessage('2'),
      ];

      act(() => {
        result.current.setMessages(messages);
      });

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].id).toBe('1');
      expect(result.current.messages[1].id).toBe('2');
    });

    it('should replace existing messages', () => {
      const { result } = renderHook(() => useMessageStore());
      
      act(() => {
        result.current.setMessages([createMessage('1')]);
        result.current.setMessages([createMessage('2')]);
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].id).toBe('2');
    });
  });

  describe('addMessage', () => {
    it('should add a message to the beginning', () => {
      const { result } = renderHook(() => useMessageStore());
      
      act(() => {
        result.current.setMessages([createMessage('1')]);
        result.current.addMessage(createMessage('2'));
      });

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].id).toBe('2'); // New message at beginning
      expect(result.current.messages[1].id).toBe('1');
    });

    it('should add message to empty array', () => {
      const { result } = renderHook(() => useMessageStore());
      
      act(() => {
        result.current.addMessage(createMessage('1'));
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].id).toBe('1');
    });
  });

  describe('updateMessage', () => {
    it('should update a specific message', () => {
      const { result } = renderHook(() => useMessageStore());
      
      act(() => {
        result.current.setMessages([
          createMessage('1'),
          createMessage('2'),
        ]);
        result.current.updateMessage('1', { isRead: true });
      });

      const message1 = result.current.messages.find((m) => m.id === '1');
      const message2 = result.current.messages.find((m) => m.id === '2');

      expect(message1?.isRead).toBe(true);
      expect(message2?.isRead).toBe(false);
    });

    it('should update multiple fields', () => {
      const { result } = renderHook(() => useMessageStore());
      
      act(() => {
        result.current.setMessages([createMessage('1')]);
        result.current.updateMessage('1', {
          isRead: true,
          priority: 0.9,
        });
      });

      const message = result.current.messages[0];
      expect(message.isRead).toBe(true);
      expect(message.priority).toBe(0.9);
    });

    it('should not update non-existent message', () => {
      const { result } = renderHook(() => useMessageStore());
      
      act(() => {
        result.current.setMessages([createMessage('1')]);
        result.current.updateMessage('999', { isRead: true });
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].id).toBe('1');
    });
  });

  describe('removeMessage', () => {
    it('should remove a message by ID', () => {
      const { result } = renderHook(() => useMessageStore());
      
      act(() => {
        result.current.setMessages([
          createMessage('1'),
          createMessage('2'),
          createMessage('3'),
        ]);
        result.current.removeMessage('2');
      });

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages.map((m) => m.id)).not.toContain('2');
    });

    it('should handle removing non-existent message', () => {
      const { result } = renderHook(() => useMessageStore());
      
      act(() => {
        result.current.setMessages([createMessage('1')]);
        result.current.removeMessage('999');
      });

      expect(result.current.messages).toHaveLength(1);
    });
  });

  describe('markAsRead', () => {
    it('should mark a message as read', () => {
      const { result } = renderHook(() => useMessageStore());
      
      act(() => {
        result.current.setMessages([
          createMessage('1'),
          createMessage('2'),
        ]);
        result.current.markAsRead('1');
      });

      const message1 = result.current.messages.find((m) => m.id === '1');
      const message2 = result.current.messages.find((m) => m.id === '2');

      expect(message1?.isRead).toBe(true);
      expect(message2?.isRead).toBe(false);
    });
  });

  describe('markAsUnread', () => {
    it('should mark a message as unread', () => {
      const { result } = renderHook(() => useMessageStore());
      
      act(() => {
        const message = createMessage('1');
        message.isRead = true;
        result.current.setMessages([message]);
        result.current.markAsUnread('1');
      });

      const message = result.current.messages[0];
      expect(message.isRead).toBe(false);
    });
  });

  describe('clearMessages', () => {
    it('should clear all messages', () => {
      const { result } = renderHook(() => useMessageStore());
      
      act(() => {
        result.current.setMessages([
          createMessage('1'),
          createMessage('2'),
        ]);
        result.current.clearMessages();
      });

      expect(result.current.messages).toHaveLength(0);
    });
  });
});

