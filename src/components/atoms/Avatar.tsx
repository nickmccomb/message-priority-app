import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from './Text';
import { cn } from '../../utils/cn';

interface AvatarProps extends ViewProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const textSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-primary-500',
    'bg-urgent',
    'bg-high',
    'bg-normal',
    'bg-slack',
    'bg-email',
    'bg-whatsapp',
    'bg-linkedin',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function Avatar({ name, size = 'md', className, ...props }: AvatarProps) {
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return (
    <View
      className={cn(
        'rounded-full items-center justify-center',
        sizeStyles[size],
        bgColor,
        className
      )}
      {...props}
    >
      <Text
        className={cn('font-semibold text-white', textSizeStyles[size])}
      >
        {initials}
      </Text>
    </View>
  );
}

