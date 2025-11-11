import React from "react";
import { View } from "react-native";
import { Text } from "../../../components/atoms/Text";
import type { Message } from "../../../types/message";
import { useTranslation } from "react-i18next";

interface MessageDetailContentProps {
  message: Message;
}

export function MessageDetailContent({ message }: MessageDetailContentProps) {
  const { t } = useTranslation();

  return (
    <>
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
    </>
  );
}

