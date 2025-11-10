import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/atoms/Text";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

export function Messages() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4">
        <Text.H1>{t("messages.screen.title")}</Text.H1>
      </View>
    </SafeAreaView>
  );
}
