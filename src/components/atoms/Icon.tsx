import { View, ViewProps } from "react-native";

import type { MessageSource } from "../../types/message";
import React from "react";
import { Text } from "./Text";
import { cn } from "../../utils/cn";

interface IconProps extends ViewProps {
  source: MessageSource;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sourceEmojis: Record<MessageSource, string> = {
  slack: "💬",
  email: "📧",
  whatsapp: "💚",
  linkedin: "💼",
};

const sizeStyles = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function Icon({ source, size = "md", className, ...props }: IconProps) {
  return (
    <View
      className={cn("items-center justify-center", sizeStyles[size], className)}
      {...props}
    >
      <Text
        className={cn(
          "text-base",
          size === "sm" && "text-sm",
          size === "lg" && "text-lg"
        )}
      >
        {sourceEmojis[source]}
      </Text>
    </View>
  );
}
