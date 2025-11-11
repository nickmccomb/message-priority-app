import { Pressable, View } from "react-native";

import type { Message } from "../../types/message";
import { MessageHeader } from "../molecules/MessageHeader";
import { MessagePreview } from "../molecules/MessagePreview";
import { PriorityIndicator } from "../molecules/PriorityIndicator";
import React from "react";
import { SourceBadge } from "../molecules/SourceBadge";
import { cn } from "../../utils/cn";

interface MessageItemProps {
  message: Message;
  onPress?: (message: Message) => void;
  className?: string;
}

export function MessageItem({ message, onPress, className }: MessageItemProps) {
  const handlePress = () => {
    onPress?.(message);
  };

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
}
