import { MessageDetail } from "../../features/message-detail/MessageDetail";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <MessageDetail messageId={id} />;
}
