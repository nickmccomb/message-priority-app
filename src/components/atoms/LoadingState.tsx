import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "./Text";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message,
  className,
}: LoadingStateProps) {
  return (
    <View className={`flex-1 items-center justify-center ${className || ""}`}>
      <ActivityIndicator size="large" />
      {message && (
        <Text.Body className="mt-4 text-gray-500 dark:text-gray-400">
          {message}
        </Text.Body>
      )}
    </View>
  );
}

