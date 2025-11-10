import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cn } from '../../utils/cn';

interface TextProps extends RNTextProps {
  className?: string;
}

const TextBase = React.forwardRef<RNText, TextProps>(
  ({ className, ...props }, ref) => {
    return (
      <RNText
        ref={ref}
        className={cn('text-gray-900 dark:text-white', className)}
        {...props}
      />
    );
  }
);

TextBase.displayName = 'Text';

// H1 - Large heading
const H1 = React.forwardRef<RNText, TextProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextBase
        ref={ref}
        className={cn('text-4xl font-bold', className)}
        {...props}
      />
    );
  }
);
H1.displayName = 'Text.H1';

// H2 - Medium heading
const H2 = React.forwardRef<RNText, TextProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextBase
        ref={ref}
        className={cn('text-3xl font-bold', className)}
        {...props}
      />
    );
  }
);
H2.displayName = 'Text.H2';

// H3 - Small heading
const H3 = React.forwardRef<RNText, TextProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextBase
        ref={ref}
        className={cn('text-2xl font-semibold', className)}
        {...props}
      />
    );
  }
);
H3.displayName = 'Text.H3';

// Body - Default body text
const Body = React.forwardRef<RNText, TextProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextBase
        ref={ref}
        className={cn('text-base', className)}
        {...props}
      />
    );
  }
);
Body.displayName = 'Text.Body';

// Small - Small text
const Small = React.forwardRef<RNText, TextProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextBase
        ref={ref}
        className={cn('text-sm', className)}
        {...props}
      />
    );
  }
);
Small.displayName = 'Text.Small';

// Caption - Very small text
const Caption = React.forwardRef<RNText, TextProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextBase
        ref={ref}
        className={cn('text-xs text-gray-600 dark:text-gray-400', className)}
        {...props}
      />
    );
  }
);
Caption.displayName = 'Text.Caption';

// Label - Form label style
const Label = React.forwardRef<RNText, TextProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextBase
        ref={ref}
        className={cn('text-sm font-medium', className)}
        {...props}
      />
    );
  }
);
Label.displayName = 'Text.Label';

// Compose the component with sub-components
export const Text = Object.assign(TextBase, {
  H1,
  H2,
  H3,
  Body,
  Small,
  Caption,
  Label,
});

export type { TextProps };

