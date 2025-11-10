import React, { useState } from "react";

import type { Message } from "../../types/message";
import { MessageList } from "../../components/organisms/MessageList";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/atoms/Text";
import { View } from "react-native";
import { mockMessages } from "../../utils/mockData";
import { useTranslation } from "react-i18next";

export function Messages() {
  const { t } = useTranslation();
  const [messages] = useState<Message[]>(mockMessages);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: Implement actual refresh logic with React Query
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleMessagePress = (message: Message) => {
    // TODO: Navigate to message detail or mark as read
    console.log("Message pressed:", message.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Text.H1>{t("messages.screen.title")}</Text.H1>
      </View>
      {messages.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text.Body className="text-gray-500 dark:text-gray-400">
            {t("messages.screen.empty")}
          </Text.Body>
        </View>
      ) : (
        <MessageList
          messages={messages}
          onMessagePress={handleMessagePress}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}
    </SafeAreaView>
  );
}
