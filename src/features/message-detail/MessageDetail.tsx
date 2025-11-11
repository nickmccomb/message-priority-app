import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";

import { EmptyState } from "../../components/atoms/EmptyState";
import { MessageDetailContent } from "./components/Content";
import { MessageDetailHeader } from "./components/Header";
import { MessageDetailMetadata } from "./components/Metadata";
import { useMarkAsRead } from "../../hooks/useMessages";
import { useMessageStore } from "../../stores/messageStore";
import { useTranslation } from "react-i18next";

interface MessageDetailProps {
  messageId: string;
}

export function MessageDetail({ messageId }: MessageDetailProps) {
  const { t } = useTranslation();
  const { messages } = useMessageStore();
  const markAsReadMutation = useMarkAsRead();

  const message = messages.find((m) => m.id === messageId);

  // Mark as read when screen is viewed
  useEffect(() => {
    if (message && !message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
  }, [message, markAsReadMutation]);

  if (!message) {
    return <EmptyState message={t("messages.detail.notFound")} />;
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="px-4 py-6 gap-6">
        <MessageDetailHeader message={message} />
        <MessageDetailContent message={message} />
        <MessageDetailMetadata message={message} />
      </View>
    </ScrollView>
  );
}
