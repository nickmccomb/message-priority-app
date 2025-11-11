import React, { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { Alert, View } from "react-native";
import {
  useMessagesError,
  useMessagesIsRefetching,
  useMessagesLoading,
  useMessagesRefetch,
} from "../../hooks/useMessages";

import type { LegendListRef, LegendListRenderItemProps } from "@legendapp/list";
import { useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { type BottomSheetRef } from "../../components/atoms/BottomSheet";
import { EmptyState } from "../../components/atoms/EmptyState";
import { ErrorState } from "../../components/atoms/ErrorState";
import { ListView } from "../../components/atoms/ListView";
import { LoadingState } from "../../components/atoms/LoadingState";
import { MessageItem } from "../../components/organisms/MessageItem";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useFilterStore } from "../../stores/filterStore";
import { useMessageStore } from "../../stores/messageStore";
import type { Message as MessageType } from "../../types/message";
import { sortMessages } from "../../utils/priority";
import { FilterBottomSheet } from "./components/FilterBottomSheet";
import { MessageActionsHeader } from "./components/MessageActionsHeader";
import { MessageCountHeader } from "./components/MessageCountHeader";

export function Messages() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const isLoading = useMessagesLoading();
  const isError = useMessagesError();
  const refetch = useMessagesRefetch();
  const isRefetching = useMessagesIsRefetching();
  const { messages, clearMessages } = useMessageStore();
  const { hideRead, filterMode } = useFilterStore();
  const filterBottomSheetRef = useRef<BottomSheetRef>(null);
  const listViewRef = useRef<LegendListRef>(null);

  // Connect to WebSocket for real-time updates
  useWebSocket();

  // Use Zustand store as source of truth (includes WebSocket updates)
  // React Query data is used to initially populate the store
  const displayMessages = useMemo(() => {
    // Zustand store is the single source of truth - it gets updated by both API and WebSocket
    let filtered = messages;

    // Filter out read messages if hideRead is enabled
    if (hideRead) {
      filtered = filtered.filter((msg) => !msg.isRead);
    }

    return sortMessages(filtered, filterMode);
  }, [messages, filterMode, hideRead]);

  const handleOpenFilter = useCallback(() => {
    filterBottomSheetRef.current?.expand();
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

  const handleScrollToTop = useCallback(() => {
    listViewRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  // Configure native header with title, message count on left, filter and clear buttons on right
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("messages.screen.title"),
      headerLeft: () => (
        <MessageCountHeader
          count={displayMessages.length}
          onPress={handleScrollToTop}
        />
      ),
      headerRight: () => (
        <MessageActionsHeader
          onFilterPress={handleOpenFilter}
          onClearPress={handleClear}
        />
      ),
    });
  }, [
    navigation,
    t,
    displayMessages.length,
    handleClear,
    handleOpenFilter,
    handleScrollToTop,
  ]);

  const handleRefresh = async () => {
    await refetch();
  };

  const handleMessagePress = useCallback(
    (message: MessageType) => {
      // Navigate to message detail screen
      router.push(`/(messages)/${message.id}`);
    },
    [router]
  );

  // ListView configuration
  const keyExtractor = useCallback((item: MessageType) => item.id, []);

  const renderItem = useCallback(
    ({ item }: LegendListRenderItemProps<MessageType>) => (
      <MessageItem message={item} onPress={handleMessagePress} />
    ),
    [handleMessagePress]
  );

  return (
    <>
      <View className="flex-1 bg-white dark:bg-gray-900">
        {isLoading && messages.length === 0 ? (
          <LoadingState message={t("messages.screen.loading")} />
        ) : isError ? (
          <ErrorState message={t("messages.screen.error")} />
        ) : displayMessages.length === 0 ? (
          <EmptyState message={t("messages.screen.empty")} />
        ) : (
          <ListView
            ref={listViewRef}
            data={displayMessages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={120}
            onRefresh={handleRefresh}
            refreshing={isRefetching}
          />
        )}
      </View>
      <FilterBottomSheet bottomSheetRef={filterBottomSheetRef} />
    </>
  );
}
