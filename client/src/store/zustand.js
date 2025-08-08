import { create } from "zustand";

const useDyeingStore = create((set) => ({
  // Core dyeing parameters
  selectedColour: "Biege",
  winch: "Soft Flow",
  dyeingSystem: "Reactive",
  scouring: "Reactive",
  softener: "",
  saltOption: "",
  saltPosition: "",
  liqRatio: "",
  lotWeight: "200",
  client: "",
  article: "",
  lotNo: "",
  dyeFix: "",
  date: new Date(),

  // Generic updater
  setField: (field, value) => set({ [field]: value }),

  // Reset all fields to initial
  resetFields: () =>
    set({
      selectedColour: "Biege",
      winch: "",
      dyeingSystem: "",
      scouring: "Reactive",
      softener: "",
      saltOption: "",
      saltPosition: "",
      liqRatio: "",
      lotWeight: "200",
      client: "",
      article: "",
      lotNo: "",
      dyeFix: "",
      date: new Date(),
    }),
}));

export default useDyeingStore;
