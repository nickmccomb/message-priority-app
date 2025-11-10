import type { Message, MessageSource } from "../types/message";

const MESSAGE_SOURCES: MessageSource[] = [
  "slack",
  "email",
  "whatsapp",
  "linkedin",
];

const SENDERS = [
  "Jane Doe",
  "John Smith",
  "Sarah Johnson",
  "Mike Chen",
  "Emily Davis",
  "David Wilson",
  "Lisa Anderson",
  "Robert Taylor",
  "Jennifer Brown",
  "Michael Martinez",
];

const SUBJECTS = [
  "Q4 Planning",
  "Meeting Notes",
  "Quick question",
  "Project Update",
  "Team Sync",
  "Action Items",
  "Follow-up Required",
  "Important Announcement",
  "Weekly Report",
  "Urgent: Please Review",
  "New Feature Proposal",
  "Budget Discussion",
  "Client Feedback",
  "Deadline Reminder",
  "Status Update",
];

const PREVIEWS = [
  "Hey, can we sync on the Q4 roadmap? I have some ideas about the new features we discussed.",
  "Here are the notes from yesterday's meeting. Please review and let me know if you have any questions.",
  "Are you available for a quick call this afternoon?",
  "I noticed we have mutual connections and would love to connect.",
  "The project is progressing well. Here's the latest update on our milestones.",
  "Could you please review the attached document and provide feedback?",
  "We need to discuss the upcoming deadline and resource allocation.",
  "Great work on the recent deliverables! Let's schedule a celebration.",
  "I have a few questions about the implementation approach.",
  "The client has requested some changes. Let's discuss how to proceed.",
  "Here's the weekly summary of our team's accomplishments.",
  "We're running into some technical challenges. Need your input.",
  "The budget proposal has been approved. Next steps outlined below.",
  "Reminder: The deadline for submissions is approaching.",
  "New feature request from stakeholders. Let's prioritize this.",
];

/**
 * Generate a random message with realistic data
 * @param idSuffix Optional suffix to ensure unique IDs when generating multiple messages
 */
export function generateRandomMessage(idSuffix?: number): Message {
  const source =
    MESSAGE_SOURCES[Math.floor(Math.random() * MESSAGE_SOURCES.length)];
  const sender = SENDERS[Math.floor(Math.random() * SENDERS.length)];
  const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  const preview = PREVIEWS[Math.floor(Math.random() * PREVIEWS.length)];

  // Generate timestamp within last 7 days
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const randomTimestamp = new Date(
    Math.floor(Math.random() * (now - sevenDaysAgo) + sevenDaysAgo)
  ).toISOString();

  // Generate priority (0-1 scale, weighted towards higher priorities)
  const priority =
    Math.random() < 0.3
      ? Math.random() * 0.4 + 0.6 // 30% chance of high priority (0.6-1.0)
      : Math.random() * 0.6; // 70% chance of lower priority (0-0.6)

  // Random boolean flags
  const isRead = Math.random() < 0.6; // 60% chance of being read
  const isUrgent = Math.random() < 0.2; // 20% chance of being urgent
  const senderVIP = Math.random() < 0.15; // 15% chance of VIP sender

  // Generate unique ID
  const baseId = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 11);
  const id =
    idSuffix !== undefined
      ? `msg_${baseId}_${idSuffix}_${randomPart}`
      : `msg_${baseId}_${randomPart}`;

  return {
    id,
    source,
    sender,
    subject,
    preview,
    timestamp: randomTimestamp,
    priority: Math.round(priority * 100) / 100, // Round to 2 decimal places
    isRead,
    isUrgent,
    senderVIP,
  };
}

/**
 * Mock API function to fetch messages
 * Generates random messages to simulate fetching from backend
 * In production, this would make an actual HTTP request
 */
export async function fetchMessages(): Promise<Message[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate random number of messages (between 10 and 50)
  const messageCount = Math.floor(Math.random() * 40) + 10;
  const messages: Message[] = [];

  for (let i = 0; i < messageCount; i++) {
    messages.push(generateRandomMessage(i));
  }

  // In production: return fetch('/api/messages').then(res => res.json())
  return messages;
}

/**
 * Mock API function to mark a message as read
 */
export async function markMessageAsRead(messageId: string): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In production: return fetch(`/api/messages/${messageId}/read`, { method: 'POST' })
}

/**
 * Mock API function to archive a message
 */
export async function archiveMessage(messageId: string): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In production: return fetch(`/api/messages/${messageId}/archive`, { method: 'POST' })
}

/**
 * Mock API function to delete a message
 */
export async function deleteMessage(messageId: string): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In production: return fetch(`/api/messages/${messageId}`, { method: 'DELETE' })
}
