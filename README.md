# Message Priority App

A high-performance mobile messaging application built with React Native and Expo, designed to help users prioritize and manage messages from multiple communication platforms.

## 📸 Screenshots

### Messages List
<img width="1320" height="2868" alt="simulator_screenshot_B4699174-085A-4542-92D4-24FE225B1AA5" src="https://github.com/user-attachments/assets/6b5eea2a-eedd-4cd0-b5db-b7dffe8f559b" />
*Main messages feed with priority-based sorting, real-time updates, and filtering options*

### Filter Options
<img width="1320" height="2868" alt="simulator_screenshot_EC844C8B-9682-40E2-8F94-F808488B0A57" src="https://github.com/user-attachments/assets/091d0f1d-79d6-4933-bf3b-2303e7590ca2" />
*Filter bottom sheet allowing users to sort by priority, time, or both, and hide read messages*

### Message Detail
<img width="1320" height="2868" alt="simulator_screenshot_88EA931A-5866-4441-BCF0-1ADC344992E1" src="https://github.com/user-attachments/assets/eddcfb5e-25a6-4eac-aca8-f27b32b62537" />
*Detailed message view with sender information, priority score, and full content*

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- iOS Simulator (for macOS) or Android Emulator
- Expo CLI (optional, we use `bunx expo`)

### Installation

```bash
# Install dependencies
bun install

# Start the development server
bun run start

# For development builds (not Expo Go)
bun run prebuild:clean
bun run ios  # or bun run android
```

### Troubleshooting

If you encounter build issues, try:

```bash
# Fix dependency issues
bunx expo install --fix

# Clean and rebuild
rm -rf ios android node_modules
bun install
bun run prebuild:clean
```

## 📋 Problem Decomposition

### Core Challenges

1. **Message Prioritization**: Display messages sorted by relevance and importance
2. **Real-time Updates**: Handle incoming messages via WebSocket while maintaining UI responsiveness
3. **Offline Support**: Ensure full functionality when offline with local caching
4. **Performance**: Smooth scrolling through large message lists (100-500 visible items)
5. **State Management**: Coordinate data from API, WebSocket, and local storage
6. **Cross-platform Consistency**: Maintain identical behavior on iOS and Android

### Solution Approach

- **Hybrid Architecture**: Combined UI/UX focus (Option A) with offline-first capabilities (Option B) and cross-platform considerations (Option C)
- **Layered State Management**: React Query for server state, Zustand for client state, MMKV for persistence
- **Optimistic UI**: Immediate feedback for user actions with rollback on errors
- **Performance Optimization**: Virtualized lists, selective re-renders, and efficient data structures

## 🏗️ Architecture & Design Decisions

### Component Architecture

Following **Atomic Design** principles:

- **Atoms**: Basic building blocks (Text, Badge, Avatar, ListView, EmptyState, LoadingState, ErrorState)
- **Molecules**: Composed atoms (MessageHeader, MessagePreview, SourceBadge)
- **Organisms**: Complex components (MessageItem, BottomSheet)
- **Templates**: Screen layouts
- **Features**: Domain-specific modules (`features/messages`, `features/message-detail`)

### Data Flow

```
┌─────────────┐
│   API/WS    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│ React Query │────▶│  Zustand     │
│  (Server)   │     │  (Client)    │
└─────────────┘     └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │     MMKV     │
                    │ (Persistence)│
                    └──────────────┘
```

### State Management Strategy

1. **React Query**: Handles API calls, caching, and synchronization
   - Deduplicates requests
   - Automatic retry logic
   - Background refetching

2. **Zustand**: Manages client-side state
   - Messages array (single source of truth)
   - Filter preferences
   - Theme preferences
   - Optimistic updates

3. **MMKV**: Ultra-fast persistence
   - Messages cache
   - User preferences
   - Offline action queue (future)

### Performance Optimizations

1. **List Virtualization**: Using `@legendapp/list` (superior to FlatList/FlashList)
   - Only renders visible items
   - Efficient memory usage
   - Smooth 60fps scrolling

2. **Selective Re-renders**: React Query selectors prevent unnecessary updates
   - Separate hooks for `isLoading`, `isError`, `refetch`, `isRefetching`
   - Components only re-render when their specific data changes

3. **Memoization**: Strategic use of `useMemo` and `useCallback`
   - Filtered/sorted messages memoized
   - Callback functions memoized to prevent child re-renders

4. **Optimistic Updates**: Immediate UI feedback
   - Mark as read instantly
   - Rollback on error

## 🛠️ Technology Choices

### Core Framework

- **React Native + Expo**: Cross-platform development with managed workflow
  - Fast iteration with Expo Go (development)
  - Native builds for production
  - Access to native APIs when needed

### State Management

- **TanStack Query (React Query)**: Server state management
  - Built-in caching, deduplication, and synchronization
  - Automatic background updates
  - Optimistic update support

- **Zustand**: Client state management
  - Lightweight (no boilerplate)
  - TypeScript-first
  - Easy to test

- **react-native-mmkv-storage**: Persistence layer
  - 30x faster than AsyncStorage
  - Synchronous API
  - Perfect for Zustand persistence

### UI & Styling

- **NativeWind (Tailwind CSS)**: Utility-first styling
  - Consistent design system
  - Dark mode support
  - Responsive design

- **@gorhom/bottom-sheet**: Native bottom sheets
  - Smooth animations
  - Gesture handling
  - Platform-optimized

### Performance

- **@legendapp/list**: High-performance list virtualization
  - Superior to FlatList and FlashList
  - Better memory management
  - Smoother scrolling

### Internationalization

- **i18next + react-i18next**: Translation support
  - Flat JSON structure
  - Type-safe translations
  - Easy to extend

## 📊 Trade-offs & Decisions

### Performance vs Features

- **Chosen**: Performance-first approach
  - Virtualized lists for large datasets
  - Selective re-renders with React Query selectors
  - Memoization to prevent unnecessary computations
  - **Trade-off**: Slightly more complex code, but ensures smooth UX

### Native vs Cross-platform

- **Chosen**: Cross-platform with React Native
  - Single codebase for iOS and Android
  - Expo managed workflow for faster development
  - Native modules when needed (MMKV, bottom-sheet)
  - **Trade-off**: Some platform-specific optimizations may be limited, but development speed and consistency outweigh this

### State Management Complexity

- **Chosen**: Layered approach (React Query + Zustand)
  - React Query for server state (caching, sync)
  - Zustand for client state (UI, preferences)
  - **Trade-off**: More libraries to learn, but clear separation of concerns

### Offline-First vs Online-First

- **Chosen**: Hybrid approach
  - Local caching with MMKV
  - Optimistic updates
  - Action queue for offline (future)
  - **Trade-off**: More complex sync logic, but better UX offline

### Code Organization

- **Chosen**: Feature-based + Atomic Design
  - Features grouped by domain (`features/messages`, `features/message-detail`)
  - Components organized by complexity (atoms, molecules, organisms)
  - **Trade-off**: More files/folders, but better maintainability and discoverability

## 🎯 Key Features Implemented

✅ **Message List**
- Priority-based sorting (priority + time, priority only, time only)
- Real-time updates via WebSocket
- Pull-to-refresh
- Filter read messages
- Scroll to top

✅ **Message Detail**
- Full message content
- Mark as read on view
- Priority display
- Source badges
- Metadata display

✅ **Performance**
- Smooth scrolling (60fps)
- Efficient memory usage
- Optimized re-renders
- Fast persistence

✅ **Offline Support**
- Local message cache
- Persistent preferences
- Optimistic UI updates

✅ **User Experience**
- Dark mode support
- Internationalization (i18n)
- Native bottom sheets
- Loading/error/empty states

## 📁 Project Structure

```
src/
├── app/                    # Expo Router routes
├── components/
│   ├── atoms/              # Basic components
│   ├── molecules/          # Composed components
│   └── organisms/          # Complex components
├── features/
│   ├── messages/           # Messages feature
│   └── message-detail/     # Message detail feature
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
├── types/                  # TypeScript types
├── utils/                  # Utility functions
└── i18n/                   # Translations
```

## 🔄 Data Flow Example

1. **Initial Load**: React Query fetches messages → Updates Zustand → Persists to MMKV
2. **WebSocket Update**: WebSocket receives message → Updates Zustand → UI updates
3. **User Action**: User marks as read → Optimistic update → API call → Rollback on error
4. **Filter Change**: User changes filter → Zustand updates → Memoized list re-sorts

## 🚧 Future Enhancements

- [ ] Offline action queue with sync on reconnect
- [ ] Conflict resolution for concurrent edits
- [ ] Push notifications
- [ ] Message search
- [ ] Archive/delete functionality
- [ ] Automatic translation in CI/CD
- [ ] Component integration tests
- [ ] E2E tests with Detox or Maestro
- [ ] Performance monitoring

## 🧪 Testing

This project uses [Bun's built-in test runner](https://bun.sh/docs/cli/test) for fast, reliable testing.

### Running Tests

```bash
# Run all tests
npm test
# or
bun test

# Run tests in watch mode
npm run test:watch
# or
bun --watch test

# Run tests with coverage
npm run test:coverage
# or
bun test --coverage
```

### Test Structure

Tests are located alongside the code they test:
- `src/**/__tests__/**/*.test.{ts,tsx}` - Test files
- `bun.setup.ts` - Test setup and mocks
- `bunfig.toml` - Bun test configuration

### Test Coverage

Current test coverage includes:
- ✅ Utility functions (cn, messageHelpers, priority, messageDeduplication)
- ✅ Store logic (messageStore, filterStore)
- ✅ All tests passing (55 tests)

### Why Bun?

- **Performance**: ~6x faster than Jest (200-400ms vs 800ms+)
- **Simplicity**: Built-in test runner, no extra configuration
- **Native TypeScript**: No transpilation overhead
- **Modern API**: Clean, intuitive syntax

## 📝 Development Notes

- Uses Bun as package manager and test runner for faster installs and tests
- Development builds required (not Expo Go) for native modules
- TypeScript strict mode enabled
- ESLint + Prettier for code quality

## 📄 License

Private project for Kinso Mobile Engineering Challenge
