import BottomSheetComponent, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetProps,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo } from "react";
import { View, useColorScheme } from "react-native";
import { cn } from "../../utils/cn";
import { Text } from "./Text";

export type BottomSheetRef = BottomSheetComponent;

interface BottomSheetAtomProps extends Omit<BottomSheetProps, "snapPoints"> {
  snapPoints?: string[] | number[];
  children: React.ReactNode;
  enableBackdrop?: boolean;
  backdropOpacity?: number;
  className?: string;
}

/**
 * Base BottomSheet component with backdrop support
 * Provides a dimmed background overlay when the sheet is open
 */
const BottomSheetBase = React.forwardRef<
  BottomSheetComponent,
  BottomSheetAtomProps
>(
  (
    {
      snapPoints = ["50%"],
      children,
      enableBackdrop = true,
      backdropOpacity = 0.5,
      backgroundStyle,
      handleIndicatorStyle,
      className,
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

    // Backdrop component for dimmed background
    const renderBackdrop = useCallback(
      (backdropProps: any) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={backdropOpacity}
          style={[
            backdropProps.style,
            {
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.8)"
                : "rgba(0, 0, 0, 0.5)",
            },
          ]}
        />
      ),
      [backdropOpacity, isDark]
    );

    const defaultBackgroundStyle = {
      backgroundColor: isDark ? "#111827" : "#ffffff",
    };

    const defaultHandleIndicatorStyle = {
      backgroundColor: isDark ? "#6b7280" : "#9ca3af",
    };

    return (
      <BottomSheetComponent
        ref={ref}
        snapPoints={memoizedSnapPoints}
        enablePanDownToClose
        backgroundStyle={backgroundStyle ?? defaultBackgroundStyle}
        handleIndicatorStyle={
          handleIndicatorStyle ?? defaultHandleIndicatorStyle
        }
        backdropComponent={enableBackdrop ? renderBackdrop : undefined}
        {...props}
      >
        <BottomSheetView className={cn("flex-1", className)}>
          {children}
        </BottomSheetView>
      </BottomSheetComponent>
    );
  }
);

BottomSheetBase.displayName = "BottomSheet";

// Header sub-component
interface BottomSheetHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const Header = React.forwardRef<View, BottomSheetHeaderProps>(
  ({ title, description, className }, ref) => {
    return (
      <View ref={ref} className={cn("mb-4", className)}>
        <Text.H3 className="mb-2">{title}</Text.H3>
        {description && (
          <Text.Caption className="text-gray-600 dark:text-gray-400">
            {description}
          </Text.Caption>
        )}
      </View>
    );
  }
);

Header.displayName = "BottomSheet.Header";

// Body sub-component
interface BottomSheetBodyProps {
  children: React.ReactNode;
  className?: string;
}

const Body = React.forwardRef<View, BottomSheetBodyProps>(
  ({ children, className }, ref) => {
    return (
      <View ref={ref} className={cn("flex-1", className)}>
        {children}
      </View>
    );
  }
);

Body.displayName = "BottomSheet.Body";

// Footer sub-component
interface BottomSheetFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Footer = React.forwardRef<View, BottomSheetFooterProps>(
  ({ children, className }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700",
          className
        )}
      >
        {children}
      </View>
    );
  }
);

Footer.displayName = "BottomSheet.Footer";

// Compose the component with sub-components
export const BottomSheet = Object.assign(BottomSheetBase, {
  Header,
  Body,
  Footer,
});
