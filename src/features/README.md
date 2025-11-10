# Features

This directory contains feature modules organized by domain/functionality. Each feature is self-contained with its own components, hooks, stores, and utilities.

## Structure

```
features/
├── messages/              # Messages feature
│   ├── MessagesScreen.tsx
│   ├── components/        # Feature-specific components
│   ├── hooks/            # Feature-specific hooks
│   ├── stores/           # Feature-specific stores
│   └── utils/            # Feature-specific utilities
└── [other-features]/     # Other features
```

## Pattern

Each feature follows this pattern:

1. **Screen Component**: Main screen component (e.g., `MessagesScreen.tsx`)
2. **Route Integration**: Routes in `app/` import and render the feature screen
3. **Self-Contained**: Feature-specific code lives within the feature folder
4. **Shared Code**: Use `components/`, `utils/`, `theme/` for shared functionality

## Usage

Routes in `app/` should be thin wrappers that import feature screens:

```tsx
// app/(messages)/index.tsx
import { MessagesScreen } from '../../features/messages/MessagesScreen';

export default function MessagesIndex() {
  return <MessagesScreen />;
}
```

## Benefits

- **Organization**: Related code is grouped together
- **Scalability**: Easy to add new features
- **Maintainability**: Clear separation of concerns
- **Reusability**: Features can be easily moved or reused
