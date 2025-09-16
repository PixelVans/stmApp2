import useDyeingStore from "../../store/zustand";
import useWeavingData from "./useWeavingProductionData";

export default function useProductionSteps() {
  const { selectedWeek } = useDyeingStore();
  const { data, loading, error } = useWeavingData(selectedWeek);

  let steps = null;
  let summary = null;

  if (!loading && !error && data) {

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

    const days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

    const sumWeek = (machineId, key) =>
      days.reduce(
        (sum, d) => sum + (Number(data[d].machines[machineId][key]) || 0),
        0
      );

    const buildRows = (machineId) =>
      rowTemplates(machineId).map((template) => {
        const row = {
          prodInfo: template.prodInfo,
          mon: data.Mon.machines[machineId][template.key] ?? "",
          tue: data.Tue.machines[machineId][template.key] ?? "",
          wed: data.Wed.machines[machineId][template.key] ?? "",
          thur: data.Thur.machines[machineId][template.key] ?? "",
          fri: data.Fri.machines[machineId][template.key] ?? "",
          sat: data.Sat.machines[machineId][template.key] ?? "",
          sun: data.Sun.machines[machineId][template.key] ?? "",
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
      dailyTotals[day.toLowerCase()] = Object.values(data[day].machines).reduce(
        (sum, machine) =>
          sum + (Number(machine.shiftA) || 0) + (Number(machine.shiftB) || 0),
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
      avgA: machineTotalsA.reduce((a, b) => a + b, 0) / machineTotalsA.length,
      avgB: machineTotalsB.reduce((a, b) => a + b, 0) / machineTotalsB.length,
      weeklyA,
      weeklyB,
      weeklyTotal: weeklyA + weeklyB,
    };
  }

  return { steps, summary, loading, error };
}
