import { LegendList, type LegendListRenderItemProps } from "@legendapp/list";
import React from "react";
import type { Message } from "../../types/message";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  onMessagePress?: (message: Message) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  className?: string;
}

export function MessageList({
  messages,
  onMessagePress,
  onRefresh,
  refreshing = false,
  className,
}: MessageListProps) {
  const renderItem = ({ item }: LegendListRenderItemProps<Message>) => (
    <MessageItem message={item} onPress={onMessagePress} />
  );

  return (
    <LegendList
      data={messages}
      renderItem={renderItem}
      estimatedItemSize={100}
      onRefresh={onRefresh}
      refreshing={refreshing}
      className={className}
    />
  );
}
