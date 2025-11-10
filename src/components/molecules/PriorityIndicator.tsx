import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '../../utils/cn';

interface PriorityIndicatorProps extends ViewProps {
  priority: number; // 0-1 scale
  isUrgent?: boolean;
  className?: string;
}

function getPriorityColor(priority: number, isUrgent?: boolean): string {
  if (isUrgent) {
    return 'bg-urgent';
  }
  if (priority >= 0.7) {
    return 'bg-high';
  }
  if (priority >= 0.4) {
    return 'bg-normal';
  }
  return 'bg-gray-400';
}

export function PriorityIndicator({
  priority,
  isUrgent = false,
  className,
  ...props
}: PriorityIndicatorProps) {
  const color = getPriorityColor(priority, isUrgent);

  return (
    <View
      className={cn('w-1 h-full rounded-full', color, className)}
      {...props}
    />
  );
}

