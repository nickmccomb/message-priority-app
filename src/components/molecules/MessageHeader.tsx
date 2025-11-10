import React from 'react';
import { View } from 'react-native';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { Text } from '../atoms/Text';
import { cn } from '../../utils/cn';

interface MessageHeaderProps {
  sender: string;
  timestamp: string;
  senderVIP?: boolean;
  isRead?: boolean;
  className?: string;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return date.toLocaleDateString();
}

export function MessageHeader({
  sender,
  timestamp,
  senderVIP = false,
  isRead = false,
  className,
}: MessageHeaderProps) {
  return (
    <View className={cn('flex-row items-center gap-2', className)}>
      <Avatar name={sender} size="sm" />
      <View className="flex-1 flex-row items-center gap-2">
        <Text.Body className={cn('font-semibold', !isRead && 'font-bold')}>
          {sender}
        </Text.Body>
        {senderVIP && <Badge variant="primary" size="sm">VIP</Badge>}
      </View>
      <Text.Caption>{formatTimestamp(timestamp)}</Text.Caption>
    </View>
  );
}

