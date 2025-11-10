export type MessageSource = 'slack' | 'email' | 'whatsapp' | 'linkedin';

export interface Message {
  id: string;
  source: MessageSource;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string; // ISO 8601
  priority: number; // 0-1 scale
  isRead: boolean;
  isUrgent: boolean;
  senderVIP: boolean;
}

