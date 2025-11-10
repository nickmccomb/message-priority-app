# Message Priority Feed - Design Document

## Problem Statement

We're building a simplified version of a mobile message prioritization interface. Users receive messages from multiple communication platforms on their phone, and we need to help them focus on what matters most through an intuitive, **extremely performant** mobile experience.

## The Goal

Design and implement a mobile interface that:

- ✅ Displays messages from multiple sources (email, chat, social media, etc.)
- ✅ Shows messages sorted by priority scores
- ✅ Provides smooth, performant scrolling for large message lists
- ✅ Handles real-time updates when new messages arrive
- ✅ Works seamlessly offline and online

## Approach Selection

**Selected Approach: Hybrid - Option A + Elements of B & C**

We're taking a comprehensive approach that combines the best of all three options:

### Primary Focus: Option A - UI/UX & State Management
- Message list component with virtualization/optimization (Legend List)
- Priority-based visual hierarchy (colors, badges, layouts)
- State management for messages and priority updates
- Pull-to-refresh and real-time update handling
- Basic navigation structure

### Integrated: Option B - Offline-First & Sync Strategy
- **Local caching of messages**: All messages cached locally via MMKV
- **Offline queue for user actions**: Queue mark-read, archive, etc. when offline
- **Sync strategy**: Automatic sync when connection returns
- **Optimistic UI updates**: All actions update immediately, sync in background
- **Conflict resolution**: Handle conflicts when syncing queued actions

### Integrated: Option C - Cross-Platform Architecture
- **Shared business logic**: Reusable hooks and utilities
- **Component structure**: Atomic design with reusability
- **Performance optimization strategies**: Cross-platform performance considerations
- **Platform-specific considerations**: iOS vs Android optimizations

**Rationale**: This comprehensive approach demonstrates full-stack mobile engineering thinking - not just UI polish, but robust offline capabilities, data persistence, sync strategies, and cross-platform architecture. We want to build a production-ready solution that works seamlessly online and offline, with optimistic UI and intelligent sync handling.

## Core Principles

### 1. Performance First
- **Target Metrics:**
  - Scroll performance: Zero jank, smooth scrolling at 60+ FPS
  - List rendering: Handle 100-500 visible messages smoothly
  - Real-time updates: < 100ms latency for new message insertion
  - UI frame rate: Consistent 60 FPS
  - Time to Interactive (TTI): < 1 second

### 2. Optimistic UI (Core Principle)
- **Immediate Feedback**: All user actions receive instant visual feedback
- **Instant Updates**: Messages appear instantly in the UI before server confirmation
- **Action Updates**: Mark-as-read, archive, delete actions update immediately
- **No Waiting**: Users never wait for network requests to see their actions
- **Background Sync**: Network requests happen in background, UI stays responsive
- **Error Handling**: Gracefully handle failures and show retry options if needed

### 3. Offline-First Architecture (Option B Integration)
- **Full Offline Functionality**: Complete app functionality available offline
- **Local Caching**: All messages cached locally via MMKV persistence
- **Action Queue**: Queue user actions when offline, process when online
- **Seamless Transitions**: Smooth transition between online/offline states
- **Sync Strategy**: Intelligent sync when connection returns
- **Conflict Resolution**: Handle conflicts when syncing queued actions
- **Data Consistency**: Maintain consistency across online/offline states

### 4. Scalability
- Handle ~1K messages per user per day
- Support 10K+ active users
- Efficient rendering of large lists (100-500 visible messages)
- Memory-efficient message storage

## Data Model

### Message Structure

```typescript
interface Message {
  id: string;                    // "msg_123"
  source: MessageSource;         // "slack" | "email" | "whatsapp" | "linkedin"
  sender: string;                // "Jane Doe"
  subject: string;                // "Q4 Planning"
  preview: string;                // "Hey, can we sync on the Q4 roadmap..."
  timestamp: string;              // ISO 8601: "2024-03-15T10:30:00Z"
  priority: number;               // 0-1 scale (0.85)
  isRead: boolean;               // false
  isUrgent: boolean;              // true
  senderVIP: boolean;            // true
}
```

### Priority Signals

Priority scores are calculated based on:
- **Sender importance**: VIP badge status
- **Urgency indicators**: Red/orange/green visual indicators
- **Unread status**: Unread messages get priority boost
- **Timestamp**: Recent messages prioritized
- **Source type**: Different sources may have different base priorities

## Technical Architecture

### Performance Optimizations

#### List Rendering
- **Legend List**: Ultra-high-performance list virtualization (superior to FlashList and FlatList)
- **getItemType**: Different item types for different message sources
- **estimatedItemSize**: Accurate size estimation for better performance
- **removeClippedSubviews**: Remove off-screen views from memory
- **maxToRenderPerBatch**: Optimize batch rendering size
- **windowSize**: Control render window for memory efficiency

#### State Management
- **React Query (TanStack Query)**: 
  - API calls to fetch latest messages (mocked)
  - Used for initial load and pull-to-refresh
  - Intelligent caching and background refetching
  - Optimistic updates for user actions
  - Automatic refetching on focus/reconnect
  - Request deduplication
  - Fetches data and syncs to Zustand store
- **WebSocket (Mocked)**:
  - Real-time message delivery channel
  - Receives new messages as they arrive
  - Updates Zustand store immediately
  - Handles connection lifecycle (connect, disconnect, reconnect)
  - Automatic reconnection with exponential backoff
  - Message deduplication to prevent duplicates
- **Zustand**: 
  - **Primary message storage**: All messages stored in Zustand store
  - Persistent state via MMKV integration
  - UI state (filters, sort order, selected messages)
  - Minimal re-renders with selective subscriptions
  - Single source of truth for message data
- **React Native MMKV**:
  - Ultra-fast key-value storage for persistence
  - Zustand store automatically persists to MMKV
  - Offline-first data availability
  - Instant app startup with cached data

#### Real-Time Updates
- **Dual Channel Architecture**:
  - **API (REST)**: Used for initial load and pull-to-refresh
  - **WebSocket**: Used for real-time message delivery
- **WebSocket Message Handling**:
  - Receive messages via WebSocket connection
  - Update Zustand store immediately
  - Persist to MMKV automatically
  - Optimistic insertion: New messages appear instantly
- **Efficient Diffing**: Only update changed messages
- **Priority Re-sorting**: Maintain sorted order after updates
- **Debounced Updates**: Batch rapid updates to prevent jank
- **Message Deduplication**: Prevent duplicate messages from WebSocket and API

#### Component Optimization
- **React.memo**: Memoize message list items
- **useMemo**: Memoize sorted/filtered message lists
- **useCallback**: Stable callback references
- **Custom Hooks**: Extract business logic for reusability

### Architecture Patterns

#### Component Structure
```
app/
  (messages)/
    index.tsx              # Main feed screen
    explore.tsx            # Additional screens (mock)
  components/
    MessageList/           # Virtualized list component
      MessageList.tsx
      MessageItem.tsx      # Individual message item
      MessageItemSkeleton.tsx
    PriorityBadge/         # Priority indicators
    SourceIcon/            # Platform icons
    PullToRefresh/         # Refresh control
    BottomSheet/           # Bottom sheet components
      MessageActionsSheet.tsx
      FilterSheet.tsx
  hooks/
    useMessages.ts         # React Query hook for fetching (API)
    useWebSocket.ts        # WebSocket connection and message handling
    useMessageStore.ts     # Zustand store hook
    useMessageActions.ts   # Mark read, archive, etc. (with optimistic updates)
    usePrioritySort.ts     # Priority sorting logic
    useOfflineSync.ts      # Offline detection and sync logic
    useActionQueue.ts      # Action queue management
  stores/
    messageStore.ts        # Zustand store with MMKV persistence
    actionQueueStore.ts    # Queue for offline actions
  i18n/
    index.ts               # i18next configuration
    locales/               # Translation files
      en.json
      es.json
      ...
  types/
    message.ts             # TypeScript interfaces
  utils/
    priority.ts            # Priority calculation
    mockData.ts            # Mock API responses
    api.ts                 # Mock API functions
    websocket.ts           # Mock WebSocket implementation
    messageDeduplication.ts # Prevent duplicate messages from API/WebSocket
```

#### Data Flow
```
User Action → Optimistic Update → API Call (mocked) → Server Response → Reconciliation
```

#### State Management Flow
```
React Query (API Layer)
  ├── Fetches messages from API (mocked)
  ├── Used for initial load and pull-to-refresh
  ├── Background refetching
  └── Syncs data to Zustand store

WebSocket (Real-Time Layer)
  ├── Maintains persistent connection (mocked)
  ├── Receives real-time messages
  ├── Updates Zustand store immediately
  ├── Automatic reconnection
  └── Message deduplication with API

Zustand (Message Storage + UI State)
  ├── Messages array (primary storage)
  ├── Receives updates from API and WebSocket
  ├── Persisted to MMKV automatically
  ├── Filter preferences
  ├── Sort order
  └── Selected messages

MMKV (Persistence Layer)
  ├── Zustand store persistence
  ├── Offline data availability
  └── Fast read/write operations
```

#### Data Flow
```
App Start → Load from MMKV (Zustand) → Display cached messages instantly
         → React Query fetches latest (API) → Update Zustand → Persist to MMKV
         → WebSocket connects → Receives real-time messages → Update Zustand → Persist to MMKV

Message Delivery Channels:
  API (REST):
    - Initial load (on screen mount)
    - Pull-to-refresh
    - Manual refresh
    → Fetches batch of messages → Updates Zustand → Persists to MMKV

  WebSocket:
    - Real-time message delivery
    - Continuous connection (reconnects automatically)
    → Receives individual messages → Updates Zustand → Persists to MMKV
    → Deduplicates with API messages to prevent duplicates

User Action (Online):
  → Update Zustand immediately (optimistic)
  → Persist to MMKV
  → Show optimistic UI
  → React Query API call (mocked) in background
  → Reconcile if server response differs

User Action (Offline):
  → Update Zustand immediately (optimistic)
  → Persist to MMKV
  → Queue action in MMKV (with metadata)
  → Show optimistic UI
  → When online: Process queued actions
  → Sync with server and resolve conflicts
```

## Key Features

### Message Feed
- **Virtualized List**: Efficient rendering of large message lists
- **Priority Sorting**: Messages sorted by priority score (highest first)
- **Visual Hierarchy**: 
  - Color coding (red/orange/green) for urgency
  - VIP badges for important senders
  - Unread indicators
  - Source icons (Slack, Email, WhatsApp, LinkedIn)

### Real-Time Updates
- **Dual Channel Message Delivery**:
  - **API (REST)**: Initial load and pull-to-refresh
  - **WebSocket**: Real-time message delivery (mocked)
- **Pull-to-Refresh**: Manual refresh via API
- **WebSocket Connection**:
  - Maintains persistent connection for real-time updates
  - Automatic reconnection on disconnect
  - Receives messages as they arrive
  - Updates UI immediately
- **Message Deduplication**: Prevents duplicate messages from both channels
- **Smooth Animations**: Animated insertions using React Native Reanimated
- **Optimistic UI**: Immediate feedback for all actions

### User Actions
- **Mark as Read**: Toggle read status (via bottom sheet)
- **Archive**: Remove from feed (via bottom sheet)
- **Bottom Sheet Actions**: 
  - Accessible via long press or action button
  - Smooth native animations
  - Multiple action options
- **Swipe Actions**: Quick actions via gestures (future enhancement)

### Offline Support (Option B Integration)
- **MMKV Persistence**: All messages persisted locally via MMKV
- **Instant Load**: App loads instantly with cached data from MMKV
- **Full Offline Functionality**: Complete app functionality available offline
- **Action Queue System**: 
  - Queue user actions (mark read, archive, delete) when offline
  - Store queued actions in MMKV with metadata (timestamp, action type, message ID)
  - Automatic processing when connection returns
- **Sync Strategy**:
  - React Query automatically syncs messages when connection returns
  - Process queued actions in order
  - Handle conflicts intelligently (last-write-wins with user preference)
  - Background sync without blocking UI
- **Optimistic Updates**: 
  - All actions update Zustand/MMKV immediately
  - UI reflects changes instantly, regardless of network state
  - Background reconciliation with server when online
- **Conflict Resolution**:
  - Detect conflicts when syncing queued actions
  - User preference-based resolution (last action wins, or prompt user)
  - Maintain data consistency across devices

## Performance Benchmarks

### Target Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Scroll FPS | 60 FPS | Consistent frame rate during scrolling |
| List Render Time | < 16ms | Time to render visible items |
| Real-time Update Latency | < 100ms | Time from event to UI update |
| Memory Usage | < 100MB | For 500 visible messages |
| Time to Interactive | < 1s | App startup to usable state |

### Performance Strategies

1. **Virtualization**: Only render visible items + small buffer
2. **Memoization**: Prevent unnecessary re-renders
3. **Debouncing**: Batch rapid updates
4. **Lazy Loading**: Load images/media on demand
5. **Efficient Sorting**: Use stable sort algorithms, memoize results

## User Experience

### Visual Design
- **Priority Indicators**: 
  - Red: Urgent messages
  - Orange: High priority
  - Green: Normal priority
- **Source Icons**: Visual distinction for each platform
- **VIP Badges**: Highlight important senders
- **Unread Indicators**: Clear visual distinction for unread messages

### Interactions
- **Smooth Scrolling**: Native-feel scrolling performance
- **Pull-to-Refresh**: Standard mobile refresh pattern
- **Tap to Expand**: View full message (mock)
- **Swipe Gestures**: Quick actions (future)

### Responsiveness
- **Instant Feedback**: All actions respond immediately
- **Loading States**: Skeleton screens during initial load
- **Error Handling**: Graceful error messages (i18n support)
- **Empty States**: Helpful empty state messages (i18n support)

### Internationalization
- **Multi-language Support**: Full i18next integration
- **Dynamic Language Switching**: Change language on the fly
- **RTL Support**: Right-to-left language support
- **Localized Formatting**: Dates, numbers, and text formatting

### Bottom Sheets
- **Native Performance**: @gorhom/bottom-sheet for smooth animations
- **Message Actions**: Mark read, archive, delete, etc.
- **Filter Options**: Source filtering, priority filtering
- **Settings**: App preferences and configuration

## Technology Stack

### Core
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and tooling
- **TypeScript**: Type-safe development
- **Expo Router**: File-based routing

### Performance Libraries
- **Legend List**: Ultra-high-performance list virtualization (better than FlashList and FlatList)
- **React Native Reanimated**: Smooth animations on UI thread
- **React Native Gesture Handler**: Native gesture recognition
- **React Query**: Data fetching, caching, and optimistic updates

### State Management & Persistence
- **Zustand**: Primary message storage and UI state management
- **React Query**: API data fetching layer (mocked) - initial load and pull-to-refresh
- **React Native MMKV**: Ultra-fast persistence for Zustand store

### Real-Time Communication
- **WebSocket (Mocked)**: Real-time message delivery
  - Mock WebSocket implementation for development
  - Simulates real-time message arrival
  - Handles connection lifecycle (connect, disconnect, reconnect)
  - Automatic reconnection with exponential backoff
  - Message deduplication with API messages

### Styling
- **NativeWind**: Tailwind CSS for React Native
- **Tailwind Merge**: Merge Tailwind classes intelligently

### Internationalization
- **i18next**: Translation and internationalization framework
- **react-i18next**: React bindings for i18next

### UI Components
- **@gorhom/bottom-sheet**: Native bottom sheet component
  - Message actions (mark read, archive, etc.)
  - Filter options
  - Settings and preferences

### Development Tools
- **Bun**: Fast package manager and runtime
- **TypeScript**: Type checking
- **ESLint**: Code linting

## Implementation Plan

### Phase 1: Core Structure & Data Layer (20 min)
- Set up message types and interfaces
- Create mock data generator and API functions
- Set up Zustand store with MMKV persistence
- Set up React Query with mock API (syncs to Zustand)
- Implement action queue system in Zustand/MMKV
- Configure offline detection and sync triggers
- Configure NativeWind and Tailwind Merge
- Set up i18next with initial translations
- Basic list component structure

### Phase 2: List Performance (20 min)
- Implement Legend List with virtualization
- Add priority sorting logic
- Optimize item rendering with memoization
- Implement pull-to-refresh

### Phase 3: Visual Hierarchy (15 min)
- Add priority indicators (colors, badges)
- Source icons and visual distinction
- Unread indicators
- Styling with NativeWind/Tailwind
- Implement bottom sheet for message actions
- Add i18n translations for UI text

### Phase 4: Real-Time Updates & Offline Sync (15 min)
- WebSocket connection management (connect, disconnect, reconnect)
- Real-time message delivery via WebSocket (mocked)
- Message deduplication between API and WebSocket
- Optimistic updates for user actions (online and offline)
- Action queue processing when connection returns
- Conflict resolution logic
- Smooth animations for new messages (from both channels)
- Maintain sorted order
- Offline indicator and sync status
- WebSocket connection status indicator

## Trade-offs Considered

### Performance vs Features
- **Chosen**: Focus on core feed performance over advanced features
- **Rationale**: Demonstrates mobile performance expertise

### Native vs Cross-Platform
- **Chosen**: React Native/Expo for rapid development
- **Rationale**: Faster iteration, still demonstrates mobile thinking

### State Management Complexity
- **Chosen**: React Query (API layer) + Zustand (message storage) + MMKV (persistence)
- **Rationale**: 
  - React Query handles API fetching and caching
  - Zustand provides simple, performant state management
  - MMKV gives ultra-fast persistence for offline-first experience
  - Clear separation of concerns: API → Store → Persistence

### Styling Approach
- **Chosen**: NativeWind (Tailwind CSS) + Tailwind Merge
- **Rationale**: 
  - Rapid UI development with utility classes
  - Consistent design system
  - Tailwind Merge prevents class conflicts
  - Familiar Tailwind syntax for web developers

### Internationalization
- **Chosen**: i18next + react-i18next
- **Rationale**: 
  - Industry-standard i18n solution
  - Easy to add new languages
  - Supports pluralization and interpolation
  - Good React Native integration

### Real API vs Mocked
- **Chosen**: Mocked API with setTimeout simulation
- **Rationale**: Focus on mobile architecture, not backend integration
- **Note**: Architecture supports real API integration - just swap mock functions

### Comprehensive Feature Set
- **Chosen**: Implement all features from Options A, B, and C
- **Rationale**: 
  - Demonstrates full mobile engineering capabilities
  - Shows understanding of offline-first architecture
  - Proves ability to handle complex state management
  - Production-ready approach, not just a demo
  - Optimistic UI works seamlessly online and offline
  - Action queuing ensures no data loss
  - Conflict resolution maintains data integrity

## Scalability Considerations

### Handling Large Lists
- Virtualization ensures only visible items are rendered
- Efficient sorting algorithms (O(n log n))
- Memoized computations prevent recalculation
- Pagination ready (not implemented in challenge scope)

### Memory Management
- RemoveClippedSubviews removes off-screen items
- Efficient image loading (lazy, cached)
- Limit cache size for React Query
- Garbage collection friendly patterns

### Network Efficiency
- **Dual Channel Strategy**:
  - API for bulk operations (initial load, refresh)
  - WebSocket for real-time updates (efficient, low overhead)
- Request deduplication via React Query
- Message deduplication between API and WebSocket
- Background refetching only when needed
- Optimistic updates reduce perceived latency
- WebSocket maintains single persistent connection
- Batching ready for future implementation

## Future Enhancements

### With More Time
- Advanced filtering and search
- Swipe gestures for quick actions
- Push notifications integration
- Deeplinking
- In-app purchases
- Analytics and performance monitoring
- Datadog RUM monitoring and error tracking
- Error boundaries and crash reporting
- A/B testing infrastructure
- Accessibility improvements
- End-to-end testing
- **Automatic translations in CI/CD**: 
  - Automated translation workflow using services like Lingo.dev or Lokalize etc
  - CI/CD pipeline integration to automatically generate translation files for new languages
  - Translation key validation and missing key detection
  - Automated PR creation for translation updates
  - Quality checks for translation completeness

## Evaluation Criteria Alignment

### Mobile-Specific Challenges
- ✅ Virtualized lists for performance
- ✅ Real-time update handling (WebSocket + API dual channel)
- ✅ Offline-first architecture
- ✅ Smooth scrolling optimization
- ✅ WebSocket connection management (reconnect, lifecycle)

### Trade-offs
- ✅ Performance prioritized over feature completeness
- ✅ Cross-platform for speed, but mobile-native thinking
- ✅ Mocked API to focus on mobile architecture

### Architecture Thinking
- ✅ Clear component structure
- ✅ Separation of concerns (data/UI)
- ✅ Reusable hooks and utilities
- ✅ Scalable patterns

### Technology Choices
- ✅ Legend List for ultra-high-performance list rendering (superior to FlashList and FlatList)
- ✅ React Query for API data fetching (mocked) - initial load and pull-to-refresh
- ✅ WebSocket (mocked) for real-time message delivery
- ✅ Zustand for message storage and UI state
- ✅ MMKV for ultra-fast persistence
- ✅ NativeWind + Tailwind Merge for styling
- ✅ i18next for internationalization
- ✅ @gorhom/bottom-sheet for native bottom sheets
- ✅ TypeScript for type safety

### Performance Awareness
- ✅ Virtualization for large lists
- ✅ Memoization to prevent re-renders
- ✅ Efficient sorting algorithms
- ✅ Optimistic updates for perceived performance

---

**Challenge Context**: Kinso Mobile Engineering Challenge  
**Approach**: Hybrid - Option A (Primary) + Elements of B & C  
**Time Budget**: ~1 hour (comprehensive implementation)  
**Last Updated**: 2024
