# Internationalization (i18n)

This directory contains internationalization configuration and translation files.

## Structure

```
i18n/
├── index.ts           # i18next configuration
└── locales/           # Translation files
    └── en.json        # English translations
```

## Translation File Structure

Translation files use a flat structure with dot notation:

```json
{
  "messages.screen.title": "Messages",
  "messages.screen.empty": "No messages",
  "messages.screen.loading": "Loading messages...",
  "messages.screen.error": "Failed to load messages"
}
```

## Usage

Use the `useTranslation` hook in components:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <Text>{t('messages.screen.title')}</Text>;
}
```

## Adding New Translations

1. Add keys to `locales/en.json` using dot notation
2. Use the keys in components with `t('key.name')`
3. For new languages, create `locales/[lang].json` and add to i18n config

