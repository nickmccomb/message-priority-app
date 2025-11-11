import { Pressable } from "react-native";
import React from "react";
import { Text } from "../../../components/atoms/Text";

interface MessageCountHeaderProps {
  count: number;
  onPress?: () => void;
}

export function MessageCountHeader({
  count,
  onPress,
}: MessageCountHeaderProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      className="pl-4"
    >
      <Text.Body className="text-gray-600 dark:text-gray-400">
        {count}
      </Text.Body>
    </Pressable>
  );
}
