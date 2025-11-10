# Composition Pattern Guide

This guide explains how to use the composition pattern in our component library, specifically for components like `Text` that provide multiple variants.

## What is Composition Pattern?

The composition pattern allows a component to expose multiple related components as properties, providing a clean API for different variants.

## Example: Text Component

Our `Text` component uses composition to provide multiple typography variants:

```tsx
import { Text } from '@/src/components/atoms/Text';

// Base component
<Text>Default text</Text>

// Variants via composition
<Text.H1>Heading 1</Text.H1>
<Text.H2>Heading 2</Text.H2>
<Text.H3>Heading 3</Text.H3>
<Text.Body>Body text</Text.Body>
<Text.Small>Small text</Text.Small>
<Text.Caption>Caption text</Text.Caption>
<Text.Label>Label text</Text.Label>
```

## How It Works

The composition pattern is implemented using `Object.assign()`:

```tsx
export const Text = Object.assign(TextBase, {
  H1,
  H2,
  H3,
  Body,
  Small,
  Caption,
  Label,
});
```

This creates a component that:
- Can be used directly: `<Text>...</Text>`
- Has sub-components as properties: `<Text.H1>...</Text.H1>`

## Benefits

1. **Clean API**: `Text.H1` is more semantic than `<Text variant="h1">`
2. **Type Safety**: TypeScript knows about all variants
3. **Discoverability**: IDE autocomplete shows all available variants
4. **Consistency**: Enforces consistent typography across the app
5. **Flexibility**: Base component can still be customized

## Usage Patterns

### Basic Usage

```tsx
import { Text } from '@/src/components/atoms/Text';

function MyComponent() {
  return (
    <View>
      <Text.H1>Main Title</Text.H1>
      <Text.Body>Description text</Text.Body>
      <Text.Caption>Metadata</Text.Caption>
    </View>
  );
}
```

### With Custom Classes

All variants accept a `className` prop for additional styling:

```tsx
<Text.H1 className="text-center text-blue-500">
  Centered Blue Heading
</Text.H1>

<Text.Body className="italic">
  Italic body text
</Text.Body>
```

### Conditional Rendering

```tsx
const isLarge = true;

{isLarge ? (
  <Text.H1>Large Title</Text.H1>
) : (
  <Text.H2>Smaller Title</Text.H2>
)}
```

## Available Text Variants

| Variant | Size | Weight | Use Case |
|---------|------|--------|----------|
| `Text.H1` | `text-4xl` | `font-bold` | Main page titles |
| `Text.H2` | `text-3xl` | `font-bold` | Section titles |
| `Text.H3` | `text-2xl` | `font-semibold` | Subsection titles |
| `Text.Body` | `text-base` | Normal | Paragraph text |
| `Text.Small` | `text-sm` | Normal | Secondary text |
| `Text.Caption` | `text-xs` | Normal | Metadata, captions |
| `Text.Label` | `text-sm` | `font-medium` | Form labels |

## Creating Your Own Composition Components

To create a component with composition:

1. **Create base component**:
```tsx
const BaseComponent = React.forwardRef(({ className, ...props }, ref) => {
  return <View ref={ref} className={cn("base-styles", className)} {...props} />;
});
```

2. **Create variant components**:
```tsx
const Variant1 = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <BaseComponent
      ref={ref}
      className={cn("variant-1-styles", className)}
      {...props}
    />
  );
});
```

3. **Compose and export**:
```tsx
export const MyComponent = Object.assign(BaseComponent, {
  Variant1,
  Variant2,
});
```

## Best Practices

1. **Use Semantic Variants**: Choose variant names that describe purpose, not appearance
2. **Consistent API**: All variants should accept the same props (className, etc.)
3. **Forward Refs**: Use `React.forwardRef` for proper ref handling
4. **Display Names**: Set `displayName` for better debugging
5. **Type Safety**: Export TypeScript types for props

## Examples in Codebase

- **Text Component**: `src/components/atoms/Text.tsx`
  - Provides H1, H2, H3, Body, Small, Caption, Label variants

## Future Components

Potential components that could use composition:

- `Button` - Button.Primary, Button.Secondary, Button.Danger
- `Input` - Input.Text, Input.Email, Input.Password
- `Card` - Card.Default, Card.Elevated, Card.Outlined

