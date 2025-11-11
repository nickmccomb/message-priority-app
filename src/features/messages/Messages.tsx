import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";
import { useMarkAsRead, useMessages } from "../../hooks/useMessages";

import type { LegendListRenderItemProps } from "@legendapp/list";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { type BottomSheetRef } from "../../components/atoms/BottomSheet";
import { ListView } from "../../components/atoms/ListView";
import { Text } from "../../components/atoms/Text";
import { MessageItem } from "../../components/organisms/MessageItem";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useMessageStore } from "../../stores/messageStore";
import type { FilterMode } from "../../types/filter";
import type { Message as MessageType } from "../../types/message";
import { sortMessages } from "../../utils/priority";
import { FilterBottomSheet } from "./components/FilterBottomSheet";

export function Messages() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isLoading, isError, refetch, isRefetching } = useMessages();
  const { messages, clearMessages } = useMessageStore();
  const markAsReadMutation = useMarkAsRead();
  const filterBottomSheetRef = useRef<BottomSheetRef>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>("both");

  // Connect to WebSocket for real-time updates
  useWebSocket();

  // Use Zustand store as source of truth (includes WebSocket updates)
  // React Query data is used to initially populate the store
  const displayMessages = useMemo(() => {
    // Zustand store is the single source of truth - it gets updated by both API and WebSocket
    return sortMessages(messages, filterMode);
  }, [messages, filterMode]);

  const handleOpenFilter = useCallback(() => {
    filterBottomSheetRef.current?.expand();
  }, []);

  const handleFilterModeChange = useCallback((mode: FilterMode) => {
    setFilterMode(mode);
  }, []);

  const handleClear = useCallback(() => {
    Alert.alert(
      t("messages.screen.clearConfirm.title"),
      t("messages.screen.clearConfirm.message"),
      [
        {
          text: t("messages.screen.clearConfirm.cancel"),
          style: "cancel",
        },
        {
          text: t("messages.screen.clearConfirm.confirm"),
          style: "destructive",
          onPress: () => clearMessages(),
        },
      ]
    );
  }, [clearMessages, t]);

  // Configure native header with title, message count on left, filter and clear buttons on right
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("messages.screen.title"),
      headerLeft: () => (
        <View className="pl-4">
          <Text.Body className="text-gray-600 dark:text-gray-400">
            {displayMessages.length}
          </Text.Body>
        </View>
      ),
      headerRight: () => (
        <View className="flex-row items-center gap-4 pr-4">
          <Pressable
            onPress={handleOpenFilter}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text.Body className="text-blue-600 dark:text-blue-400">
              {t("messages.screen.filter")}
            </Text.Body>
          </Pressable>
          <Pressable
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text.Body className="text-blue-600 dark:text-blue-400">
              {t("messages.screen.clear")}
            </Text.Body>
          </Pressable>
        </View>
      ),
    });
  }, [navigation, t, displayMessages.length, handleClear, handleOpenFilter]);

  const handleRefresh = async () => {
    await refetch();
  };

  const handleMessagePress = useCallback(
    (message: MessageType) => {
      // Mark as read if unread
      if (!message.isRead) {
        markAsReadMutation.mutate(message.id);
      }
      // TODO: Navigate to message detail
    },
    [markAsReadMutation]
  );

  // ListView configuration
  const keyExtractor = useCallback((item: MessageType) => item.id, []);

  const renderItem = useCallback(
    ({ item }: LegendListRenderItemProps<MessageType>) => (
      <MessageItem message={item} onPress={handleMessagePress} />
    ),
    [handleMessagePress]
  );

  const estimatedItemSize = useMemo(() => {
    // Average message item height: ~120px (header + preview + badge + padding)
    return 120;
  }, []);

  return (
    <>
      <View className="flex-1 bg-white dark:bg-gray-900">
        {isLoading && messages.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
            <Text.Body className="mt-4 text-gray-500 dark:text-gray-400">
              {t("messages.screen.loading")}
            </Text.Body>
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center">
            <Text.Body className="text-gray-500 dark:text-gray-400">
              {t("messages.screen.error")}
            </Text.Body>
          </View>
        ) : displayMessages.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text.Body className="text-gray-500 dark:text-gray-400">
              {t("messages.screen.empty")}
            </Text.Body>
          </View>
        ) : (
          <ListView
            data={displayMessages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={estimatedItemSize}
            onRefresh={handleRefresh}
            refreshing={isRefetching}
          />
        )}
      </View>
      <FilterBottomSheet
        bottomSheetRef={filterBottomSheetRef}
        currentMode={filterMode}
        onModeChange={handleFilterModeChange}
      />
    </>
  );
}
