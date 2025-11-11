import { Avatar } from "../atoms/Avatar";
import { Badge } from "../atoms/Badge";
import React from "react";
import { Text } from "../atoms/Text";
import { View } from "react-native";
import { cn } from "../../utils/cn";

export interface MessageHeaderProps {
  sender: string;
  timestamp: string;
  senderVIP?: boolean;
  isRead?: boolean;
  priority?: number; // 0-1 scale
  className?: string;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "Just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return date.toLocaleDateString();
}

function formatPriority(priority: number): string {
  // Ensure priority is a valid number between 0 and 1
  const clampedPriority = Math.max(0, Math.min(1, priority));
  return (clampedPriority * 100).toFixed(0);
}

export function MessageHeader({
  sender,
  timestamp,
  senderVIP = false,
  isRead = false,
  priority,
  className,
}: MessageHeaderProps) {
  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <Avatar name={sender} size="sm" />
      <View className="flex-1 flex-row items-center gap-2 min-w-0">
        <Text.Body className={cn("font-semibold", !isRead && "font-bold")}>
          {sender}
        </Text.Body>
        {senderVIP && (
          <Badge variant="primary" size="sm">
            VIP
          </Badge>
        )}
      </View>
      <View className="flex-row items-center gap-2 flex-shrink-0">
        {typeof priority === "number" && (
          <View className="bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full">
            <Text.Small className="font-semibold text-blue-700 dark:text-blue-300">
              {formatPriority(priority)}%
            </Text.Small>
          </View>
        )}
        {isRead && (
          <View className="bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded-full">
            <Text.Small className="font-semibold text-green-700 dark:text-green-300">
              ✓
            </Text.Small>
          </View>
        )}
        <Text.Caption className="text-gray-500 dark:text-gray-400">
          {formatTimestamp(timestamp)}
        </Text.Caption>
      </View>
    </View>
  );
}
