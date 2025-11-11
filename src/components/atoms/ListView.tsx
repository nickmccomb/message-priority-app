import {
  LegendList,
  type LegendListRef,
  type LegendListRenderItemProps,
} from "@legendapp/list";
import React, { forwardRef } from "react";

export interface ListViewProps<ItemT> {
  data: readonly ItemT[];
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
export const ListView = forwardRef<LegendListRef, ListViewProps<any>>(
  function ListView(
    {
      data,
      renderItem,
      keyExtractor,
      estimatedItemSize = 100,
      onRefresh,
      refreshing = false,
      className,
    },
    ref
  ) {
    return (
      <LegendList
        ref={ref}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={estimatedItemSize}
        onRefresh={onRefresh}
        refreshing={refreshing}
        className={className}
        recycleItems
        enableAverages
        maintainVisibleContentPosition
      />
    );
  }
) as <ItemT>(
  props: ListViewProps<ItemT> & { ref?: React.Ref<LegendListRef> }
) => React.ReactElement;
