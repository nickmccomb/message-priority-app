// Bun test setup - mocks React Native and other modules before they're imported
// This prevents Bun from trying to parse Flow types in React Native

import * as React from "react";

// @ts-expect-error - bun:test is a Bun-specific module
import { mock } from "bun:test";

// Suppress react-test-renderer deprecation warnings
// This warning comes from React when react-test-renderer is imported by @testing-library/react-native
const originalWarn = console.warn;
const originalError = console.error;
const originalStderrWrite = process.stderr.write.bind(process.stderr);

console.warn = (...args: any[]) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("react-test-renderer is deprecated")
  ) {
    return; // Suppress this specific warning
  }
  originalWarn(...args);
};

console.error = (...args: any[]) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("react-test-renderer is deprecated")
  ) {
    return; // Suppress this specific warning
  }
  originalError(...args);
};

process.stderr.write = function (
  chunk: any,
  encoding?: any,
  callback?: any
): boolean {
  if (
    typeof chunk === "string" &&
    chunk.includes("react-test-renderer is deprecated")
  ) {
    return true; // Suppress this specific warning
  }
  return originalStderrWrite(chunk, encoding, callback);
};

// Mock React Native to avoid Flow type parsing issues
mock.module("react-native", () => {
  const mockComponent = (name: string) => {
    const Component = React.forwardRef((props: any, ref: any) => {
      return React.createElement("div", { ...props, "data-testid": name, ref });
    });
    Component.displayName = name;
    return Component;
  };

  return {
    View: mockComponent("View"),
    Text: mockComponent("Text"),
    ScrollView: mockComponent("ScrollView"),
    FlatList: mockComponent("FlatList"),
    StyleSheet: {
      create: (styles: any) => styles,
    },
    Platform: {
      OS: "test",
      select: (obj: any) => obj.test || obj.default,
    },
    Dimensions: {
      get: () => ({ width: 375, height: 812 }),
      addEventListener: () => {},
      removeEventListener: () => {},
    },
  };
});

// Mock react-native-mmkv-storage
mock.module("react-native-mmkv-storage", () => {
  const mockStorage = {
    setString: () => {},
    getString: () => null,
    removeItem: () => {},
  };

  return {
    MMKVLoader: class {
      withInstanceID() {
        return this;
      }
      initialize() {
        return mockStorage;
      }
    },
  };
});
