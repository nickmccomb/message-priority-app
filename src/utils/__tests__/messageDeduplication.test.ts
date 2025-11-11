import { deduplicateMessages, mergeMessages } from "../messageDeduplication";

import type { Message } from "../../types/message";

describe("messageDeduplication", () => {
  const createMessage = (
    id: string,
    timestamp: string,
    priority = 0.5
  ): Message => ({
    id,
    source: "email",
    sender: "Test Sender",
    subject: "Test Subject",
    preview: "Test preview",
    timestamp,
    priority,
    isRead: false,
    isUrgent: false,
    senderVIP: false,
  });

  describe("deduplicateMessages", () => {
    it("should remove duplicate messages by ID", () => {
      const messages: Message[] = [
        createMessage("1", "2024-01-01T10:00:00Z"),
        createMessage("2", "2024-01-01T11:00:00Z"),
        createMessage("1", "2024-01-01T12:00:00Z"), // Duplicate
      ];

      const deduplicated = deduplicateMessages(messages);

      expect(deduplicated).toHaveLength(2);
      // Map preserves insertion order: "1" inserted first, then "2"
      expect(deduplicated.map((m) => m.id)).toEqual(["1", "2"]);
      // Verify the duplicate was replaced with the newer version
      const message1 = deduplicated.find((m) => m.id === "1");
      expect(message1?.timestamp).toBe("2024-01-01T12:00:00Z");
    });

    it("should keep the most recent version of duplicate messages", () => {
      const older = createMessage("1", "2024-01-01T10:00:00Z");
      const newer = createMessage("1", "2024-01-01T12:00:00Z");

      const deduplicated = deduplicateMessages([older, newer]);

      expect(deduplicated).toHaveLength(1);
      expect(deduplicated[0].timestamp).toBe(newer.timestamp);
    });

    it("should handle messages with same ID but different timestamps", () => {
      const messages: Message[] = [
        createMessage("1", "2024-01-01T09:00:00Z"),
        createMessage("1", "2024-01-01T10:00:00Z"),
        createMessage("1", "2024-01-01T11:00:00Z"),
      ];

      const deduplicated = deduplicateMessages(messages);

      expect(deduplicated).toHaveLength(1);
      expect(deduplicated[0].timestamp).toBe("2024-01-01T11:00:00Z");
    });

    it("should handle empty array", () => {
      expect(deduplicateMessages([])).toEqual([]);
    });

    it("should handle array with no duplicates", () => {
      const messages: Message[] = [
        createMessage("1", "2024-01-01T10:00:00Z"),
        createMessage("2", "2024-01-01T11:00:00Z"),
        createMessage("3", "2024-01-01T12:00:00Z"),
      ];

      const deduplicated = deduplicateMessages(messages);

      expect(deduplicated).toHaveLength(3);
      expect(deduplicated.map((m) => m.id)).toEqual(["1", "2", "3"]);
    });

    it("should preserve message order for non-duplicates", () => {
      const messages: Message[] = [
        createMessage("1", "2024-01-01T10:00:00Z"),
        createMessage("2", "2024-01-01T11:00:00Z"),
        createMessage("3", "2024-01-01T12:00:00Z"),
      ];

      const deduplicated = deduplicateMessages(messages);

      expect(deduplicated[0].id).toBe("1");
      expect(deduplicated[1].id).toBe("2");
      expect(deduplicated[2].id).toBe("3");
    });
  });

  describe("mergeMessages", () => {
    it("should merge existing and new messages", () => {
      const existing: Message[] = [
        createMessage("1", "2024-01-01T10:00:00Z"),
        createMessage("2", "2024-01-01T11:00:00Z"),
      ];

      const newMessages: Message[] = [
        createMessage("3", "2024-01-01T12:00:00Z"),
        createMessage("4", "2024-01-01T13:00:00Z"),
      ];

      const merged = mergeMessages(existing, newMessages);

      expect(merged).toHaveLength(4);
      expect(merged.map((m) => m.id)).toContain("1");
      expect(merged.map((m) => m.id)).toContain("2");
      expect(merged.map((m) => m.id)).toContain("3");
      expect(merged.map((m) => m.id)).toContain("4");
    });

    it("should deduplicate messages when merging", () => {
      const existing: Message[] = [
        createMessage("1", "2024-01-01T10:00:00Z"),
        createMessage("2", "2024-01-01T11:00:00Z"),
      ];

      const newMessages: Message[] = [
        createMessage("2", "2024-01-01T12:00:00Z"), // Duplicate, newer
        createMessage("3", "2024-01-01T13:00:00Z"),
      ];

      const merged = mergeMessages(existing, newMessages);

      expect(merged).toHaveLength(3);
      const message2 = merged.find((m) => m.id === "2");
      expect(message2?.timestamp).toBe("2024-01-01T12:00:00Z"); // Should keep newer version
    });

    it("should handle empty existing array", () => {
      const newMessages: Message[] = [
        createMessage("1", "2024-01-01T10:00:00Z"),
      ];

      const merged = mergeMessages([], newMessages);

      expect(merged).toHaveLength(1);
      expect(merged[0].id).toBe("1");
    });

    it("should handle empty new messages array", () => {
      const existing: Message[] = [createMessage("1", "2024-01-01T10:00:00Z")];

      const merged = mergeMessages(existing, []);

      expect(merged).toHaveLength(1);
      expect(merged[0].id).toBe("1");
    });

    it("should handle both arrays empty", () => {
      expect(mergeMessages([], [])).toEqual([]);
    });

    it("should not mutate original arrays", () => {
      const existing: Message[] = [createMessage("1", "2024-01-01T10:00:00Z")];
      const newMessages: Message[] = [
        createMessage("2", "2024-01-01T11:00:00Z"),
      ];

      const existingCopy = [...existing];
      const newMessagesCopy = [...newMessages];

      mergeMessages(existing, newMessages);

      expect(existing).toEqual(existingCopy);
      expect(newMessages).toEqual(newMessagesCopy);
    });
  });
});
