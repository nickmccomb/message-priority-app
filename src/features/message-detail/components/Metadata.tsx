import React from "react";
import { View } from "react-native";
import { Text } from "../../../components/atoms/Text";
import { cn } from "../../../utils/cn";
import type { Message } from "../../../types/message";
import { useTranslation } from "react-i18next";

interface MessageDetailMetadataProps {
  message: Message;
}

export function MessageDetailMetadata({ message }: MessageDetailMetadataProps) {
  const { t } = useTranslation();

  return (
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
          {message.isRead ? t("messages.detail.read") : t("messages.detail.unread")}
        </Text.Caption>
      </View>
    </View>
  );
}

