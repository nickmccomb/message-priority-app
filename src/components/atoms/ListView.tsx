import { LegendList, type LegendListRenderItemProps } from "@legendapp/list";
import React, { useCallback, useMemo } from "react";

export interface ListViewProps<ItemT> {
  data: ReadonlyArray<ItemT>;
  renderItem: (props: LegendListRenderItemProps<ItemT>) => React.ReactElement;
  keyExtractor: (item: ItemT, index: number) => string;
  estimatedItemSize?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  className?: string;
}

/**
 * Generic, high-performance list view component
 * Wraps LegendList with optimized defaults for smooth scrolling
 */
export function ListView<ItemT>({
  data,
  renderItem,
  keyExtractor,
  estimatedItemSize = 100,
  onRefresh,
  refreshing = false,
  className,
}: ListViewProps<ItemT>) {
  // Memoize key extractor function
  const memoizedKeyExtractor = useCallback(
    (item: ItemT, index: number) => keyExtractor(item, index),
    [keyExtractor]
  );

  // Memoize render item function
  const memoizedRenderItem = useCallback(
    (props: LegendListRenderItemProps<ItemT>) => renderItem(props),
    [renderItem]
  );

  // Memoize estimated item size
  const memoizedEstimatedItemSize = useMemo(
    () => estimatedItemSize,
    [estimatedItemSize]
  );

  return (
    <LegendList
      data={data}
      renderItem={memoizedRenderItem}
      keyExtractor={memoizedKeyExtractor}
      estimatedItemSize={memoizedEstimatedItemSize}
      onRefresh={onRefresh}
      refreshing={refreshing}
      className={className}
      recycleItems
      enableAverages
      drawDistance={500}
      maintainVisibleContentPosition
      initialContainerPoolRatio={0.5}
    />
  );
}

