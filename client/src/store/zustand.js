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

const useDyeingStore = create(
  persist(
    (set, get) => ({
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

      // Week state
      selectedWeek: getISOWeek(),
      setSelectedWeek: (week) => set({ selectedWeek: week }),

      
      setField: (field, value) => set({ [field]: value }),

      
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

        
        const currentWeek = getISOWeek();
        if (state && state.selectedWeek !== currentWeek) {
          state.selectedWeek = currentWeek;
        }
      },
    }
  )
);

export default useDyeingStore;
