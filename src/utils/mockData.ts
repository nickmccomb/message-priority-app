import type { Message } from '../types/message';

/**
 * Mock messages data for development and testing
 * This will be replaced with real API data fetching
 */
export const mockMessages: Message[] = [
  {
    id: 'msg_1',
    source: 'slack',
    sender: 'Jane Doe',
    subject: 'Q4 Planning',
    preview:
      'Hey, can we sync on the Q4 roadmap? I have some ideas about the new features we discussed.',
    timestamp: new Date().toISOString(),
    priority: 0.85,
    isRead: false,
    isUrgent: true,
    senderVIP: true,
  },
  {
    id: 'msg_2',
    source: 'email',
    sender: 'John Smith',
    subject: 'Meeting Notes',
    preview:
      "Here are the notes from yesterday's meeting. Please review and let me know if you have any questions.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    priority: 0.65,
    isRead: false,
    isUrgent: false,
    senderVIP: false,
  },
  {
    id: 'msg_3',
    source: 'whatsapp',
    sender: 'Sarah Johnson',
    subject: 'Quick question',
    preview: 'Are you available for a quick call this afternoon?',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    priority: 0.45,
    isRead: true,
    isUrgent: false,
    senderVIP: false,
  },
  {
    id: 'msg_4',
    source: 'linkedin',
    sender: 'Mike Chen',
    subject: 'Connection Request',
    preview: 'I noticed we have mutual connections and would love to connect.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    priority: 0.3,
    isRead: true,
    isUrgent: false,
    senderVIP: false,
  },
];

