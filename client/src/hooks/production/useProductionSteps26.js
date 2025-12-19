
import useDyeingStore from "../../store/zustand";
import useWeavingData26 from "./useWeavingProductionData26";

export default function useProductionSteps26() {
  const { selectedWeek, selectedYear } = useDyeingStore();
  const {
    data,
    loading,
    error: fetchError,
    empty,
  } = useWeavingData26(selectedWeek, selectedYear);

  // hard stop on real errors or empty weeks
  if (loading || fetchError || empty || !data) {
    return {
      steps: null,
      summary: null,
      loading,
      error: fetchError,
      empty,
    };
  }

  const days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

  // check if any machine has data across the week
  const hasMachineData = days.some(
    (day) => Object.keys(data?.[day]?.machines ?? {}).length > 0
  );

  // no machine data → empty state, NOT error
  if (!hasMachineData) {
    return {
      steps: null,
      summary: null,
      loading: false,
      error: false,
      empty: true,
    };
  }

  // row blueprint
  const rowTemplates = (machineId) => [
  { prodInfo: `Machine ${machineId} Shift A`, key: "shiftA" },
  { prodInfo: "Notes - A", key: "notesA" },
  { prodInfo: "Beam Number", key: "beamA" },

  { prodInfo: `Machine ${machineId} Shift B`, key: "shiftB" },
  { prodInfo: "Notes - B", key: "notesB" },
  { prodInfo: "Article", key: "article" },
  { prodInfo: "Beam Number", key: "beamB" },
];


  const sumWeek = (machineId, key) =>
    days.reduce((sum, d) => {
      const machine = data?.[d]?.machines?.[machineId] ?? {};
      return sum + (Number(machine[key]) || 0);
    }, 0);

  const buildRows = (machineId) =>
    rowTemplates(machineId).map((template) => {
      const getVal = (day) =>
        data?.[day]?.machines?.[machineId]?.[template.key] ?? "";

      const row = {
        prodInfo: template.prodInfo,
        mon: getVal("Mon"),
        tue: getVal("Tue"),
        wed: getVal("Wed"),
        thur: getVal("Thur"),
        fri: getVal("Fri"),
        sat: getVal("Sat"),
        sun: getVal("Sun"),
        total: "",
      };

      if (template.key === "shiftA") {
        row.total = sumWeek(machineId, "shiftA");
      }

      if (template.key === "shiftB") {
        row.total = sumWeek(machineId, "shiftB");
      }

      // FINAL beam row shows combined total
      if (template.key === "beamB") {
        row.total =
          sumWeek(machineId, "shiftA") + sumWeek(machineId, "shiftB");
        row.isBeamB = true; // optional flag if table wants styling
      }

      return row;
    });

  // build steps for 4 machines
  const steps = Array.from({ length: 4 }, (_, i) => {
    const machineId = i + 1;
    return {
      machine: `Machine No: ${machineId}`,
      rows: buildRows(machineId),
    };
  });

  // daily totals
  const dailyTotals = {};
  days.forEach((day) => {
    const machines = data?.[day]?.machines ?? {};
    dailyTotals[day.toLowerCase()] = Object.values(machines).reduce(
      (sum, machine) =>
        sum +
        (Number(machine?.shiftA) || 0) +
        (Number(machine?.shiftB) || 0),
      0
    );
  });

  const weeklyTotal = Object.values(dailyTotals).reduce(
    (sum, val) => sum + val,
    0
  );

  // append daily total row
  steps.push({
    rows: [
      {
        prodInfo: "Daily Total",
        mon: dailyTotals.mon,
        tue: dailyTotals.tue,
        wed: dailyTotals.wed,
        thur: dailyTotals.thur,
        fri: dailyTotals.fri,
        sat: dailyTotals.sat,
        sun: dailyTotals.sun,
        total: weeklyTotal,
      },
    ],
  });

  // summary
  const machineTotalsA = [];
  const machineTotalsB = [];

  for (let m = 1; m <= 4; m++) {
    machineTotalsA.push(sumWeek(m, "shiftA"));
    machineTotalsB.push(sumWeek(m, "shiftB"));
  }

  const weeklyA = machineTotalsA.reduce((a, b) => a + b, 0);
  const weeklyB = machineTotalsB.reduce((a, b) => a + b, 0);

  const summary = {
    avgA: weeklyA / machineTotalsA.length,
    avgB: weeklyB / machineTotalsB.length,
    weeklyA,
    weeklyB,
    weeklyTotal: weeklyA + weeklyB,
  };

  return {
    steps,
    summary,
    loading: false,
    error: false,
    empty: false,
  };
}
