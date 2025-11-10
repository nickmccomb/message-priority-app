# Styling Guide

This guide covers how to use Tailwind CSS with NativeWind in our React Native application.

## Overview

We use **NativeWind** (Tailwind CSS for React Native) for styling our components. This provides a utility-first CSS approach with excellent developer experience.

## Setup

- **NativeWind**: Tailwind CSS for React Native
- **Tailwind Merge**: Intelligently merges Tailwind classes
- **Tailwind Config**: `tailwind.config.js` at project root

## Basic Usage

### Using className Prop

NativeWind components accept a `className` prop with Tailwind utility classes:

```tsx
import { View, Text } from 'react-native';

<View className="flex-1 bg-white p-4">
  <Text className="text-2xl font-bold text-gray-900">
    Hello World
  </Text>
</View>
```

### Dark Mode

Dark mode classes are automatically applied based on system/device theme:

```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">
    Adapts to theme
  </Text>
</View>
```

## Utility Functions

### cn() - Class Name Merger

Use the `cn()` utility to merge classes intelligently:

```tsx
import { cn } from '@/src/utils/cn';

<View className={cn(
  "flex-1",
  "bg-white dark:bg-gray-900",
  isActive && "border-2 border-blue-500"
)}>
```

The `cn()` function:
- Combines `clsx` for conditional classes
- Uses `tailwind-merge` to resolve conflicts
- Ensures proper class ordering

## Common Patterns

### Layout

```tsx
// Flex container
<View className="flex-1">           // Full height
<View className="flex-row">         // Horizontal layout
<View className="items-center">     // Center items
<View className="justify-between"> // Space between
```

### Spacing

```tsx
<View className="p-4">        // Padding all sides
<View className="px-4 py-2">  // Padding x/y
<View className="m-4">         // Margin all sides
<View className="gap-4">       // Gap between children
```

### Colors

```tsx
// Background colors
<View className="bg-white dark:bg-gray-900">
<View className="bg-primary-500">
<View className="bg-urgent">      // Custom color

// Text colors
<Text className="text-gray-900 dark:text-white">
<Text className="text-primary-600">
```

### Typography

```tsx
// Use Text atom component for typography
import { Text } from '@/src/components/atoms/Text';

<Text.H1>Heading 1</Text.H1>
<Text.Body>Body text</Text.Body>
```

## Custom Colors

We have custom colors defined in `tailwind.config.js`:

### Priority Colors
- `urgent` - Red for urgent messages
- `high` - Orange for high priority
- `normal` - Green for normal priority

### Source Colors
- `slack` - Slack brand color
- `email` - Email blue
- `whatsapp` - WhatsApp green
- `linkedin` - LinkedIn blue

### Primary Colors
- `primary-50` through `primary-950` - Blue scale

## Best Practices

1. **Use Text Atom**: Use `Text.H1`, `Text.Body`, etc. instead of raw Text components
2. **Dark Mode First**: Always include dark mode variants
3. **Use cn() for Conditionals**: Merge classes with `cn()` utility
4. **Consistent Spacing**: Use Tailwind spacing scale (p-4, m-2, gap-4)
5. **Responsive**: Consider responsive classes when needed

## Examples

### Card Component

```tsx
<View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
  <Text.H2 className="mb-2">Card Title</Text.H2>
  <Text.Body className="text-gray-600 dark:text-gray-300">
    Card content
  </Text.Body>
</View>
```

### Button-like View

```tsx
<View className={cn(
  "px-4 py-2 rounded-lg",
  "bg-primary-500 active:bg-primary-600",
  "flex-row items-center justify-center gap-2"
)}>
  <Text className="text-white font-semibold">Button</Text>
</View>
```

## Resources

- [NativeWind Documentation](https://www.nativewind.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Merge](https://github.com/dcastil/tailwind-merge)

