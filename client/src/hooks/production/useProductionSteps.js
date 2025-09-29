import useDyeingStore from "../../store/zustand";
import useWeavingData from "./useWeavingProductionData";

export default function useProductionSteps() {
  const { selectedWeek } = useDyeingStore();
  const { data, loading, error: fetchError } = useWeavingData(selectedWeek);

  let steps = null;
  let summary = null;
  let error = fetchError; 

  if (!loading && !error && data) {
    const days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

    // check if there is at least one machine with some data
    const hasMachineData = days.some(
      (day) => Object.keys(data?.[day]?.machines ?? {}).length > 0
    );

    if (!hasMachineData) {
      error = true; 
    } else {
      // row blueprint
      const rowTemplates = (machineId) => [
        { prodInfo: `Machine ${machineId} Shift A`, key: "shiftA" },
        { prodInfo: "Notes - A", key: "notesA" },
        { prodInfo: "Beam Number", key: "beamA" },
        { prodInfo: `Machine ${machineId} Shift B`, key: "shiftB" },
        { prodInfo: "Notes B", key: "notesB" },
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
          } else if (template.key === "shiftB") {
            row.total = sumWeek(machineId, "shiftB");
          } else if (template.key === "beamB") {
            row.total =
              sumWeek(machineId, "shiftA") + sumWeek(machineId, "shiftB");
            row.isBeamB = true;
          }

          return row;
        });

      // build steps for 4 machines
      steps = Array.from({ length: 4 }, (_, i) => {
        const machineId = i + 1;
        return {
          machine: `Machine No: ${machineId}`,
          rows: buildRows(machineId),
        };
      });

      // compute daily totals across all machines
      const dailyTotals = {};
      days.forEach((day) => {
        const machines = data?.[day]?.machines ?? {};
        dailyTotals[day.toLowerCase()] = Object.values(machines).reduce(
          (sum, machine) =>
            sum + (Number(machine?.shiftA) || 0) + (Number(machine?.shiftB) || 0),
          0
        );
      });

      const weeklyTotal = Object.values(dailyTotals).reduce(
        (sum, val) => sum + val,
        0
      );

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

      // SUMMARY CALCULATIONS
      const machineTotalsA = [];
      const machineTotalsB = [];

      for (let m = 1; m <= 4; m++) {
        machineTotalsA.push(sumWeek(m, "shiftA"));
        machineTotalsB.push(sumWeek(m, "shiftB"));
      }

      const weeklyA = machineTotalsA.reduce((a, b) => a + b, 0);
      const weeklyB = machineTotalsB.reduce((a, b) => a + b, 0);

      summary = {
        avgA:
          machineTotalsA.reduce((a, b) => a + b, 0) /
          (machineTotalsA.length || 1),
        avgB:
          machineTotalsB.reduce((a, b) => a + b, 0) /
          (machineTotalsB.length || 1),
        weeklyA,
        weeklyB,
        weeklyTotal: weeklyA + weeklyB,
      };
    }
  }

  return { steps, summary, loading, error };
}
