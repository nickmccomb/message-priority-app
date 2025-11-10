# Message Priority App

A performant mobile messaging application built with React Native, Expo, and TypeScript.

## Get Started

This project uses [Bun](https://bun.sh) as its package manager.

1. Install dependencies

   ```bash
   bun install
   ```

2. Pre-build the native projects (required for development builds)

   ```bash
   bun run prebuild
   ```

3. Start the app

   ```bash
   bun start
   # or directly
   bunx expo start
   ```

   Or run directly on device/simulator (after prebuild):

   ```bash
   # iOS
   bun ios

   # Android
   bun android
   ```

## Development Builds

This project uses **development builds** instead of Expo Go. You must pre-build the native projects before running.

### First Time Setup

```bash
# Clean prebuild (removes existing native folders first - recommended)
bun run prebuild:clean

# Or generate native iOS and Android projects
bun run prebuild

# Or prebuild for specific platform
bun run prebuild:ios
bun run prebuild:android
```

### Running on Devices

```bash
# iOS Simulator/Device
bun ios

# Android Emulator/Device
bun android
```

### Building for Production

```bash
# iOS Release Build
bun run build:ios

# Android Release Build
bun run build:android
```

## Documentation

See the [docs](./docs/) folder for detailed documentation:

- [Design Document](./docs/DESIGN.md) - Architecture and design decisions
- [Styling Guide](./docs/styling.md) - Tailwind CSS and NativeWind usage
- [Composition Pattern](./docs/composition-pattern.md) - Component composition patterns

## Project Structure

```
src/
├── app/              # Expo Router routes
├── components/       # Shared UI components (atomic design)
├── features/         # Feature modules
├── theme/            # Theme system
├── i18n/             # Internationalization
└── utils/            # Utility functions
```
