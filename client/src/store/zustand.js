import { create } from "zustand";
import { persist } from "zustand/middleware";

// Helper to get ISO week number
function getISOWeek(date = new Date()) {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

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
      soaping: "",
      date: new Date(),

      // New: current ISO week
      selectedWeek: getISOWeek(),
      setSelectedWeek: (week) => set({ selectedWeek: week }),

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
          soaping: "",
          date: new Date(),
          selectedWeek: getISOWeek(),
        }),
    }),
    {
      name: "dyeing-storage", 
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        if (state?.date) {
          state.date = new Date(state.date);
        }
      },
    }
  )
);

export default useDyeingStore;
