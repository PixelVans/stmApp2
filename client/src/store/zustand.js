import { create } from "zustand";
import { persist } from "zustand/middleware";

function getISOWeek(date = new Date()) {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((tempDate.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

// ✅ Mapping winch → default liquor ratio
const defaultLiqRatioMap = {
  "Soft Flow": 8,
  "Main Winch": 8,
  "Sample Winch": 10,
  "Paddle Winch": 15,
  "Soft Flow-Minimum": 12,
  "VAT": 12,
};

const useDyeingStore = create(
  persist(
    (set, get) => ({
      selectedColour: "Blue - Sky - Sunfix",
      winch: "Soft Flow",
      dyeingSystem: "Reactive",
      scouring: "Enzymatic",
      softener: "Bubanks",
      saltOption: "Industrial Salt",
      saltPosition: "",
      liqRatio: defaultLiqRatioMap["Soft Flow"], // ✅ initialize based on default winch
      lotWeight: "",
      client: "",
      article: "",
      lotNo: "",
      liqRatio8: "No Dye Fix",
      soaping: "",
      date: new Date(),
      selectedWeek: getISOWeek(),

      // Update selected week
      setSelectedWeek: (week) => set({ selectedWeek: week }),

      // ✅ Smart setter: updates liqRatio if winch changes
      setField: (field, value) => {
        if (field === "winch") {
          const newRatio = defaultLiqRatioMap[value] || "";
          set({ winch: value, liqRatio: newRatio });
        } else {
          set({ [field]: value });
        }
      },

      // ✅ Reset all fields (liqRatio depends on current winch)
      resetFields: () => {
        const currentWinch = get().winch; // 👈 get the currently selected winch
        const liqRatioDefault = defaultLiqRatioMap[currentWinch] || "";

        set({
          selectedColour: "Blue - Sky - Sunfix",
          dyeingSystem: "Reactive",
          scouring: "Enzymatic",
          softener: "Bubanks",
          saltOption: "Industrial Salt",
          saltPosition: "",
          liqRatio: liqRatioDefault, // ✅ match the winch’s ratio
          lotWeight: "",
          client: "",
          article: "",
          lotNo: "",
          liqRatio8: "No Dye Fix",
          soaping: "",
          date: new Date(),
          selectedWeek: getISOWeek(),
        });
      },
    }),
    {
      name: "dyeing-storage",
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        if (state?.date) state.date = new Date(state.date);

        const currentWeek = getISOWeek();
        if (state && state.selectedWeek !== currentWeek) {
          state.selectedWeek = currentWeek;
        }
      },
    }
  )
);

export default useDyeingStore;
