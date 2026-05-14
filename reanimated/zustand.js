import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useTaskFilter = create(
  persist(
    (set) => ({
      isEnabled: false,
      toggleSwitch: () => set((state) => ({ isEnabled: !state.isEnabled })),
    }),
    { name: "taskFilter", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
