import { ActivityIndicator, View } from "react-native";
import React, { useMemo } from "react";
import { useMarkAsRead, useMessages } from "../../hooks/useMessages";

import type { Message } from "../../types/message";
import { MessageList } from "../../components/organisms/MessageList";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/atoms/Text";
import { sortMessagesByPriority } from "../../utils/priority";
import { useMessageStore } from "../../stores/messageStore";
import { useTranslation } from "react-i18next";
import { useWebSocket } from "../../hooks/useWebSocket";

export function Messages() {
  const { t } = useTranslation();
  const { isLoading, isError, refetch, isRefetching } = useMessages();
  const { messages } = useMessageStore();
  const markAsReadMutation = useMarkAsRead();

  // Connect to WebSocket for real-time updates
  useWebSocket();

  // Use Zustand store as source of truth (includes WebSocket updates)
  // React Query data is used to initially populate the store
  const displayMessages = useMemo(() => {
    // Zustand store is the single source of truth - it gets updated by both API and WebSocket
    return sortMessagesByPriority(messages);
  }, [messages]);

  const handleRefresh = async () => {
    await refetch();
  };

  const handleMessagePress = (message: Message) => {
    // Mark as read if unread
    if (!message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
    // TODO: Navigate to message detail
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Text.H1>{t("messages.screen.title")}</Text.H1>
      </View>
      {isLoading && messages.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text.Body className="mt-4 text-gray-500 dark:text-gray-400">
            {t("messages.screen.loading")}
          </Text.Body>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center">
          <Text.Body className="text-gray-500 dark:text-gray-400">
            {t("messages.screen.error")}
          </Text.Body>
        </View>
      ) : displayMessages.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text.Body className="text-gray-500 dark:text-gray-400">
            {t("messages.screen.empty")}
          </Text.Body>
        </View>
      ) : (
        <MessageList
          messages={displayMessages}
          onMessagePress={handleMessagePress}
          onRefresh={handleRefresh}
          refreshing={isRefetching}
        />
      )}
    </SafeAreaView>
  );
}
