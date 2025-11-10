import React from 'react';
import { View } from 'react-native';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { cn } from '../../utils/cn';
import type { MessageSource } from '../../types/message';

interface SourceBadgeProps {
  source: MessageSource;
  className?: string;
}

const sourceLabels: Record<MessageSource, string> = {
  slack: 'Slack',
  email: 'Email',
  whatsapp: 'WhatsApp',
  linkedin: 'LinkedIn',
};

export function SourceBadge({ source, className }: SourceBadgeProps) {
  return (
    <View className={cn('flex-row items-center gap-1.5', className)}>
      <Icon source={source} size="sm" />
      <Text.Caption>{sourceLabels[source]}</Text.Caption>
    </View>
  );
}

