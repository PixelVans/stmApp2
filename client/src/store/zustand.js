import { create } from "zustand";

const useDyeingStore = create((set) => ({
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
      dyeingSystem: "",
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
}));

export default useDyeingStore;
