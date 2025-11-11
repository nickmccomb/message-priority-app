import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Avatar } from "../../components/atoms/Avatar";
import { Badge } from "../../components/atoms/Badge";
import { Text } from "../../components/atoms/Text";
import { SourceBadge } from "../../components/molecules/SourceBadge";
import { useMarkAsRead } from "../../hooks/useMessages";
import { useMessageStore } from "../../stores/messageStore";
import { cn } from "../../utils/cn";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatPriority(priority: number): string {
  const clampedPriority = Math.max(0, Math.min(1, priority));
  return (clampedPriority * 100).toFixed(0);
}

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { messages } = useMessageStore();
  const markAsReadMutation = useMarkAsRead();

  const message = messages.find((m) => m.id === id);

  // Mark as read when screen is viewed
  useEffect(() => {
    if (message && !message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
  }, [message, markAsReadMutation]);

  if (!message) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <Text.Body className="text-gray-500 dark:text-gray-400">
          {t("messages.detail.notFound")}
        </Text.Body>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="px-4 py-6 gap-6">
        {/* Header Section */}
        <View className="gap-4">
          <View className="flex-row items-center gap-3">
            <Avatar name={message.sender} size="lg" />
            <View className="flex-1 gap-1">
              <View className="flex-row items-center gap-2">
                <Text.H3 className="flex-1">{message.sender}</Text.H3>
                {message.senderVIP && (
                  <Badge variant="primary" size="sm">
                    VIP
                  </Badge>
                )}
              </View>
              <Text.Caption className="text-gray-500 dark:text-gray-400">
                {formatTimestamp(message.timestamp)}
              </Text.Caption>
            </View>
          </View>

          {/* Priority Badge */}
          <View className="flex-row items-center gap-2">
            <View className="bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-full">
              <Text.Small className="font-semibold text-blue-700 dark:text-blue-300">
                {t("messages.detail.priority")}: {formatPriority(message.priority)}%
              </Text.Small>
            </View>
            <SourceBadge source={message.source} />
          </View>
        </View>

        {/* Subject */}
        <View className="gap-2">
          <Text.Label className="text-gray-500 dark:text-gray-400">
            {t("messages.detail.subject")}
          </Text.Label>
          <Text.H2>{message.subject}</Text.H2>
        </View>

        {/* Preview/Content */}
        <View className="gap-2">
          <Text.Label className="text-gray-500 dark:text-gray-400">
            {t("messages.detail.content")}
          </Text.Label>
          <Text.Body className="leading-6">{message.preview}</Text.Body>
        </View>

        {/* Metadata */}
        <View className="pt-4 border-t border-gray-200 dark:border-gray-800 gap-3">
          <View className="flex-row justify-between">
            <Text.Caption className="text-gray-500 dark:text-gray-400">
              {t("messages.detail.messageId")}
            </Text.Caption>
            <Text.Caption className="text-gray-900 dark:text-gray-100 font-mono">
              {message.id}
            </Text.Caption>
          </View>
          <View className="flex-row justify-between">
            <Text.Caption className="text-gray-500 dark:text-gray-400">
              {t("messages.detail.source")}
            </Text.Caption>
            <Text.Caption className="text-gray-900 dark:text-gray-100 capitalize">
              {message.source}
            </Text.Caption>
          </View>
          <View className="flex-row justify-between">
            <Text.Caption className="text-gray-500 dark:text-gray-400">
              {t("messages.detail.status")}
            </Text.Caption>
            <Text.Caption
              className={cn(
                message.isRead
                  ? "text-gray-600 dark:text-gray-400"
                  : "text-blue-600 dark:text-blue-400 font-semibold"
              )}
            >
              {message.isRead
                ? t("messages.detail.read")
                : t("messages.detail.unread")}
            </Text.Caption>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

