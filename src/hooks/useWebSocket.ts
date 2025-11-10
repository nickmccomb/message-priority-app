import { useEffect, useRef } from 'react';
import { MockWebSocket } from '../utils/websocket';
import { useMessageStore } from '../stores/messageStore';
import { sortMessagesByPriority } from '../utils/priority';
import type { Message } from '../types/message';

/**
 * Hook to manage WebSocket connection for real-time message delivery
 * Automatically connects when component mounts and disconnects on unmount
 */
export function useWebSocket() {
  const { setMessages } = useMessageStore();
  const wsRef = useRef<MockWebSocket | null>(null);
  const statusRef = useRef<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  useEffect(() => {
    // Create WebSocket instance
    const ws = new MockWebSocket({
      onMessage: (message: Message) => {
        // Get current messages from store (always fresh)
        const currentMessages = useMessageStore.getState().messages;
        
        // Check if message already exists (deduplication)
        const existingMessage = currentMessages.find((m) => m.id === message.id);
        if (existingMessage) {
          console.log('Skipping duplicate message:', message.id);
          return; // Skip duplicate
        }

        console.log('WebSocket received new message:', message.id, message.subject);

        // Add message and re-sort by priority
        const updatedMessages = [...currentMessages, message];
        const sorted = sortMessagesByPriority(updatedMessages);
        setMessages(sorted);
      },
      onStatusChange: (status) => {
        statusRef.current = status;
        // Could be used to show connection status in UI
        console.log('WebSocket status:', status);
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
      },
    });

    wsRef.current = ws;

    // Connect when component mounts
    ws.connect();

    // Cleanup: disconnect when component unmounts
    return () => {
      ws.disconnect();
      wsRef.current = null;
    };
  }, [setMessages]); // Include store method in deps

  return {
    status: statusRef.current,
  };
}

