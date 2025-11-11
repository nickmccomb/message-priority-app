import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import type { FilterMode } from "../../../types/filter";
import { cn } from "../../../utils/cn";
import { BottomSheet, type BottomSheetRef } from "../../../components/atoms/BottomSheet";
import { Text } from "../../../components/atoms/Text";

interface FilterBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetRef | null>;
  currentMode: FilterMode;
  onModeChange: (mode: FilterMode) => void;
}

export function FilterBottomSheet({
  bottomSheetRef,
  currentMode,
  onModeChange,
}: FilterBottomSheetProps) {
  const { t } = useTranslation();
  const snapPoints = useMemo(() => ["40%"], []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, [bottomSheetRef]);

  const filterOptions: {
    mode: FilterMode;
    labelKey: string;
    descriptionKey: string;
  }[] = [
    {
      mode: "both",
      labelKey: "messages.filter.mode.both",
      descriptionKey: "messages.filter.mode.both.description",
    },
    {
      mode: "priority",
      labelKey: "messages.filter.mode.priority",
      descriptionKey: "messages.filter.mode.priority.description",
    },
    {
      mode: "time",
      labelKey: "messages.filter.mode.time",
      descriptionKey: "messages.filter.mode.time.description",
    },
  ];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      className="px-4 pb-4"
    >
      <BottomSheet.Header
        title={t("messages.filter.title")}
        description={t("messages.filter.description")}
      />

      <BottomSheet.Body className="gap-2">
        {filterOptions.map((option) => {
          const isSelected = currentMode === option.mode;
          return (
            <Pressable
              key={option.mode}
              onPress={() => {
                onModeChange(option.mode);
                handleClose();
              }}
              className={cn(
                "p-4 rounded-lg border-2",
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              )}
            >
              <View className="flex-row items-center justify-between mb-1">
                <Text.Body
                  className={cn(
                    "font-semibold",
                    isSelected
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-gray-900 dark:text-white"
                  )}
                >
                  {t(option.labelKey)}
                </Text.Body>
                {isSelected && (
                  <View className="w-5 h-5 rounded-full bg-blue-500 items-center justify-center">
                    <Text.Small className="text-white font-bold">✓</Text.Small>
                  </View>
                )}
              </View>
              <Text.Caption
                className={cn(
                  isSelected
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                )}
              >
                {t(option.descriptionKey)}
              </Text.Caption>
            </Pressable>
          );
        })}
      </BottomSheet.Body>
    </BottomSheet>
  );
}

