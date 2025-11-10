# Components

This directory contains reusable UI components organized using atomic design principles.

## Structure

```
components/
├── atoms/        # Basic building blocks (buttons, inputs, text, etc.)
├── molecules/    # Simple combinations of atoms
├── organisms/    # Complex UI components
└── templates/    # Page-level layouts
```

## Import Pattern

Import components directly - no index files:

```tsx
import { Button } from '@/src/components/atoms/Button';
import { Text } from '@/src/components/atoms/Text';
```

