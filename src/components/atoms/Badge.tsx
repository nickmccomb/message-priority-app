import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from './Text';
import { cn } from '../../utils/cn';

interface BadgeProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'urgent' | 'high' | 'normal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 dark:bg-gray-800',
  primary: 'bg-primary-100 dark:bg-primary-900',
  urgent: 'bg-urgent-light dark:bg-urgent-dark',
  high: 'bg-high-light dark:bg-high-dark',
  normal: 'bg-normal-light dark:bg-normal-dark',
};

const sizeStyles = {
  sm: 'px-2 py-0.5',
  md: 'px-2.5 py-1',
  lg: 'px-3 py-1.5',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  return (
    <View
      className={cn(
        'rounded-full items-center justify-center',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text.Small className="font-medium text-gray-700 dark:text-gray-300">
          {children}
        </Text.Small>
      ) : (
        children
      )}
    </View>
  );
}

