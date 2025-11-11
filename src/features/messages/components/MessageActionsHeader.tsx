import { Pressable, View } from "react-native";

import React from "react";
import { Text } from "../../../components/atoms/Text";
import { useTranslation } from "react-i18next";

interface MessageActionsHeaderProps {
  onFilterPress: () => void;
  onClearPress: () => void;
}

export function MessageActionsHeader({
  onFilterPress,
  onClearPress,
}: MessageActionsHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center gap-6">
      <Pressable
        onPress={onFilterPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text.Body className="text-blue-600 dark:text-blue-400">
          {t("messages.screen.filter")}
        </Text.Body>
      </Pressable>
      <Pressable
        onPress={onClearPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text.Body className="text-red-600 dark:text-red-400">
          {t("messages.screen.clear")}
        </Text.Body>
      </Pressable>
    </View>
  );
}
