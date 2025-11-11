import { ActivityIndicator, Alert, Pressable, View } from "react-native";
import React, { useCallback, useLayoutEffect, useMemo } from "react";
import { useMarkAsRead, useMessages } from "../../hooks/useMessages";

import type { Message } from "../../types/message";
import { MessageList } from "../../components/organisms/MessageList";
import { Text } from "../../components/atoms/Text";
import { sortMessagesByPriority } from "../../utils/priority";
import { useMessageStore } from "../../stores/messageStore";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { useWebSocket } from "../../hooks/useWebSocket";

export function Messages() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isLoading, isError, refetch, isRefetching } = useMessages();
  const { messages, clearMessages } = useMessageStore();
  const markAsReadMutation = useMarkAsRead();

  // Connect to WebSocket for real-time updates
  useWebSocket();

  // Use Zustand store as source of truth (includes WebSocket updates)
  // React Query data is used to initially populate the store
  const displayMessages = useMemo(() => {
    // Zustand store is the single source of truth - it gets updated by both API and WebSocket
    return sortMessagesByPriority(messages);
  }, [messages]);

  const handleClear = useCallback(() => {
    Alert.alert(
      t("messages.screen.clearConfirm.title"),
      t("messages.screen.clearConfirm.message"),
      [
        {
          text: t("messages.screen.clearConfirm.cancel"),
          style: "cancel",
        },
        {
          text: t("messages.screen.clearConfirm.confirm"),
          style: "destructive",
          onPress: () => clearMessages(),
        },
      ]
    );
  }, [clearMessages, t]);

  // Configure native header with title, message count on left, and clear button on right
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("messages.screen.title"),
      headerLeft: () => (
        <View className="pl-4">
          <Text.Body className="text-gray-600 dark:text-gray-400">
            {displayMessages.length}
          </Text.Body>
        </View>
      ),
      headerRight: () => (
        <Pressable
          onPress={handleClear}
          className="pr-4"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text.Body className="text-blue-600 dark:text-blue-400">
            {t("messages.screen.clear")}
          </Text.Body>
        </Pressable>
      ),
    });
  }, [navigation, t, displayMessages.length, handleClear]);

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
    <View className="flex-1 bg-white dark:bg-gray-900">
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
    </View>
  );
}
