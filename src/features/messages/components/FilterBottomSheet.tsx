import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Switch, View } from "react-native";

import {
  BottomSheet,
  type BottomSheetRef,
} from "../../../components/atoms/BottomSheet";
import { Text } from "../../../components/atoms/Text";
import { useFilterStore } from "../../../stores/filterStore";
import type { FilterMode } from "../../../types/filter";
import { cn } from "../../../utils/cn";

interface FilterBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetRef | null>;
}

export function FilterBottomSheet({ bottomSheetRef }: FilterBottomSheetProps) {
  const { t } = useTranslation();
  const { filterMode, hideRead, setFilterMode, setHideRead } = useFilterStore();
  const snapPoints = useMemo(() => ["40%"], []);

  const handleModeChange = useCallback(
    (mode: FilterMode) => {
      setFilterMode(mode);
      bottomSheetRef.current?.close();
    },
    [setFilterMode, bottomSheetRef]
  );

  const handleHideReadChange = useCallback(
    (value: boolean) => {
      setHideRead(value);
    },
    [setHideRead]
  );

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
      className="px-4 pb-12"
    >
      <BottomSheet.Header
        title={t("messages.filter.title")}
        description={t("messages.filter.description")}
      />

      <BottomSheet.Body className="gap-2">
        {filterOptions.map((option) => {
          const isSelected = filterMode === option.mode;
          return (
            <Pressable
              key={option.mode}
              onPress={() => handleModeChange(option.mode)}
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

        {/* Hide Read Messages Toggle */}
        <View className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Pressable
            onPress={() => handleHideReadChange(!hideRead)}
            className="flex-row items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <View className="flex-1 mr-4">
              <Text.Body className="font-semibold text-gray-900 dark:text-white mb-1">
                {t("messages.filter.hideRead")}
              </Text.Body>
              <Text.Caption className="text-gray-600 dark:text-gray-400">
                {t("messages.filter.hideRead.description")}
              </Text.Caption>
            </View>
            <Switch
              value={hideRead}
              onValueChange={handleHideReadChange}
              trackColor={{
                false: "#d1d5db",
                true: "#3b82f6",
              }}
              thumbColor="#ffffff"
              ios_backgroundColor="#d1d5db"
            />
          </Pressable>
        </View>
      </BottomSheet.Body>
    </BottomSheet>
  );
}
