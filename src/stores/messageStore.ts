import type { Message } from "../types/message";
import { create } from "zustand";
import { createMMKVStorage } from "./mmkvStorage";
import { persist } from "zustand/middleware";

interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      messages: [],
      setMessages: (messages) => set({ messages }),
      addMessage: (message) =>
        set((state) => ({
          messages: [message, ...state.messages],
        })),
      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        })),
      removeMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== id),
        })),
      markAsRead: (id) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, isRead: true } : msg
          ),
        })),
      markAsUnread: (id) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, isRead: false } : msg
          ),
        })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "message-storage",
      storage: createMMKVStorage("message-storage"),
    }
  )
);
