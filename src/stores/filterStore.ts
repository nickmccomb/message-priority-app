import type { FilterMode } from "../types/filter";
import { create } from "zustand";
import { createMMKVStorage } from "./mmkvStorage";
import { persist } from "zustand/middleware";

interface FilterStore {
  hideRead: boolean;
  filterMode: FilterMode;
  setHideRead: (hideRead: boolean) => void;
  setFilterMode: (mode: FilterMode) => void;
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      hideRead: false,
      filterMode: "both",
      setHideRead: (hideRead) => set({ hideRead }),
      setFilterMode: (mode) => set({ filterMode: mode }),
    }),
    {
      name: "filter-storage",
      storage: createMMKVStorage("filter-storage"),
    }
  )
);
