import React from 'react';
import { View } from 'react-native';
import { Text } from '../atoms/Text';
import { cn } from '../../utils/cn';

interface MessagePreviewProps {
  subject: string;
  preview: string;
  isRead?: boolean;
  className?: string;
}

const MAX_PREVIEW_LENGTH = 80;

function truncatePreview(text: string): string {
  if (text.length <= MAX_PREVIEW_LENGTH) {
    return text;
  }
  return `${text.slice(0, MAX_PREVIEW_LENGTH).trim()}...`;
}

export function MessagePreview({
  subject,
  preview,
  isRead = false,
  className,
}: MessagePreviewProps) {
  return (
    <View className={cn('gap-1', className)}>
      <Text.Body className={cn(!isRead && 'font-semibold')}>
        {subject}
      </Text.Body>
      <Text.Small className="text-gray-600 dark:text-gray-400">
        {truncatePreview(preview)}
      </Text.Small>
    </View>
  );
}

