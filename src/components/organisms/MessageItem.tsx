import { Pressable, View } from "react-native";
import React, { useCallback } from "react";

import { MessageHeader } from "../molecules/MessageHeader";
import { MessagePreview } from "../molecules/MessagePreview";
import type { Message as MessageType } from "../../types/message";
import { PriorityIndicator } from "../molecules/PriorityIndicator";
import { SourceBadge } from "../molecules/SourceBadge";
import { cn } from "../../utils/cn";

export interface MessageItemProps {
  message: MessageType;
  onPress?: (message: MessageType) => void;
  className?: string;
}

export const MessageItem = React.memo(function MessageItem({
  message,
  onPress,
  className,
}: MessageItemProps) {
  const handlePress = useCallback(() => {
    onPress?.(message);
  }, [onPress, message]);

  return (
    <Pressable
      onPress={handlePress}
      className={cn(
        "flex-row bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800",
        !message.isRead && "bg-gray-50 dark:bg-gray-800/50",
        className
      )}
    >
      <PriorityIndicator
        priority={message.priority}
        isUrgent={message.isUrgent}
      />
      <View className="flex-1 px-4 py-3 gap-3">
        <MessageHeader
          sender={message.sender}
          timestamp={message.timestamp}
          senderVIP={message.senderVIP}
          isRead={message.isRead}
          priority={message.priority}
        />
        <MessagePreview
          subject={message.subject}
          preview={message.preview}
          isRead={message.isRead}
        />
        <SourceBadge source={message.source} />
      </View>
    </Pressable>
  );
});

