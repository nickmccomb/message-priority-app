import React from "react";
import { View } from "react-native";
import { Text } from "./Text";

interface ErrorStateProps {
  message: string;
  className?: string;
}

export function ErrorState({ message, className }: ErrorStateProps) {
  return (
    <View className={`flex-1 items-center justify-center ${className || ""}`}>
      <Text.Body className="text-gray-500 dark:text-gray-400">
        {message}
      </Text.Body>
    </View>
  );
}

