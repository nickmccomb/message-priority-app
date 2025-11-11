import React from "react";
import { View } from "react-native";
import { Avatar } from "../../../components/atoms/Avatar";
import { Badge } from "../../../components/atoms/Badge";
import { SourceBadge } from "../../../components/molecules/SourceBadge";
import { Text } from "../../../components/atoms/Text";
import { formatPriority, formatTimestamp } from "../../../utils/messageHelpers";
import type { Message } from "../../../types/message";
import { useTranslation } from "react-i18next";

interface MessageDetailHeaderProps {
  message: Message;
}

export function MessageDetailHeader({ message }: MessageDetailHeaderProps) {
  const { t } = useTranslation();

  return (
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
  );
}

