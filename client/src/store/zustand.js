import { create } from "zustand";
import { persist } from "zustand/middleware";

const useDyeingStore = create(
  persist(
    (set) => ({
      // Core dyeing parameters
      selectedColour: "Biege",
      winch: "Soft Flow",
      dyeingSystem: "Reactive",
      scouring: "Enzymatic",
      softener: "Brenntag",
      saltOption: "Industrial Salt",
      saltPosition: "",
      liqRatio: "",
      lotWeight: "",
      client: "",
      article: "",
      lotNo: "",
      liqRatio8: "No Dye Fix",
      date: new Date(),

      // Generic updater
      setField: (field, value) => set({ [field]: value }),

      // Reset all fields to initial
      resetFields: () =>
        set({
          selectedColour: "Biege",
          winch: "Soft Flow",
          dyeingSystem: "Reactive",
          scouring: "Enzymatic",
          softener: "Brenntag",
          saltOption: "Industrial Salt",
          saltPosition: "",
          liqRatio: "",
          lotWeight: "",
          client: "",
          article: "",
          lotNo: "",
          liqRatio8: "No Dye Fix",
          date: new Date(),
        }),
    }),
    {
      name: "dyeing-storage", // localStorage key
      getStorage: () => localStorage, // (optional) defaults to localStorage
      // If you want to store Date objects properly:
      onRehydrateStorage: () => (state) => {
        if (state?.date) {
          state.date = new Date(state.date);
        }
      },
    }
  )
);

export default useDyeingStore;
