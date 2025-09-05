

// import useDyeingStore from "../../store/zustand";
// import useWeavingData from "./useWeavingProductionData";

// export default function useProductionSteps() {
//   const { selectedWeek } = useDyeingStore();
//   const { data, loading, error } = useWeavingData(selectedWeek);

//   let steps = null;
//   let summary = null;

//   if (!loading && !error && data) {
//     // row blueprint
//     const rowTemplates = (machineId) => [
//       { prodInfo: `Machine ${machineId} Shift A`, key: "shiftA" },
//       { prodInfo: "Notes - A", key: "notesA" },
//       { prodInfo: "Beam Number", key: "beam1" },
//       { prodInfo: `Machine ${machineId} Shift B`, key: "shiftB" },
//       { prodInfo: "Notes B", key: "notesB" },
//       { prodInfo: "Article", key: "article" },
//       { prodInfo: "Beam Number", key: "beam2" }, // weekly total goes here
//     ];

//     const days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

//     // helper: sum across week for one machine+key
//     const sumWeek = (machineId, key) =>
//       days.reduce(
//         (sum, d) => sum + (Number(data[d].machines[machineId][key]) || 0),
//         0
//       );

//     // build rows for each machine
//     const buildRows = (machineId) =>
//       rowTemplates(machineId).map((template) => {
//         const row = {
//           prodInfo: template.prodInfo,
//           mon: data.Mon.machines[machineId][template.key] ?? "",
//           tue: data.Tue.machines[machineId][template.key] ?? "",
//           wed: data.Wed.machines[machineId][template.key] ?? "",
//           thur: data.Thur.machines[machineId][template.key] ?? "",
//           fri: data.Fri.machines[machineId][template.key] ?? "",
//           sat: data.Sat.machines[machineId][template.key] ?? "",
//           sun: data.Sun.machines[machineId][template.key] ?? "",
//           total: "",
//         };

//         if (template.key === "shiftA") {
//           row.total = sumWeek(machineId, "shiftA");
//         } else if (template.key === "shiftB") {
//           row.total = sumWeek(machineId, "shiftB");
//         } else if (template.key === "beam2") {
//           // Beam Number row gets shiftA + shiftB total
//           row.total =
//             sumWeek(machineId, "shiftA") + sumWeek(machineId, "shiftB");
//         }

//         return row;
//       });

//     // build steps for 4 machines
//     steps = Array.from({ length: 4 }, (_, i) => {
//       const machineId = i + 1;
//       return {
//         machine: `Machine No: ${machineId}`,
//         rows: buildRows(machineId),
//       };
//     });

//     // compute daily totals across all machines
//     const dailyTotals = {};
//     days.forEach((day) => {
//       dailyTotals[day.toLowerCase()] = Object.values(data[day].machines).reduce(
//         (sum, machine) =>
//           sum + (Number(machine.shiftA) || 0) + (Number(machine.shiftB) || 0),
//         0
//       );
//     });

//     const weeklyTotal = Object.values(dailyTotals).reduce(
//       (sum, val) => sum + val,
//       0
//     );

//     steps.push({
//       rows: [
//         {
//           prodInfo: "Daily Total",
//           mon: dailyTotals.mon,
//           tue: dailyTotals.tue,
//           wed: dailyTotals.wed,
//           thur: dailyTotals.thur,
//           fri: dailyTotals.fri,
//           sat: dailyTotals.sat,
//           sun: dailyTotals.sun,
//           total: weeklyTotal,
//         },
//       ],
//     });

//     // ----- SUMMARY CALCULATIONS -----
//     const machineTotalsA = [];
//     const machineTotalsB = [];

//     for (let m = 1; m <= 4; m++) {
//       machineTotalsA.push(sumWeek(m, "shiftA"));
//       machineTotalsB.push(sumWeek(m, "shiftB"));
//     }

//     const weeklyA = machineTotalsA.reduce((a, b) => a + b, 0);
//     const weeklyB = machineTotalsB.reduce((a, b) => a + b, 0);

//     summary = {
//       avgA: machineTotalsA.reduce((a, b) => a + b, 0) / machineTotalsA.length,
//       avgB: machineTotalsB.reduce((a, b) => a + b, 0) / machineTotalsB.length,
//       weeklyA,
//       weeklyB,
//       weeklyTotal: weeklyA + weeklyB,
//     };
//   }

//   return { steps, summary, loading, error };
// }





import { useMemo } from "react";
import useDyeingStore from "../../store/zustand";
import useWeavingData from "./useWeavingProductionData";


export default function useProductionSteps() {
 const { selectedWeek } = useDyeingStore();
 const { data, loading, error } = useWeavingData(selectedWeek);
 let steps = null;
  if (!loading && !error && data) {

    
    steps = [
      {
    machine: "Machine No: 1",
    rows: [
      {
        prodInfo:"Machine 1 Shift A",
        mon: data.Mon.machines[1].shiftA, 
        tue: data.Tue.machines[1].shiftA, 
        wed: data.Wed.machines[1].shiftA, 
        thur: data.Thur.machines[1].shiftA ,
        fri: data.Fri.machines[1].shiftA, 
        sat: data.Sat.machines[1].shiftA,
        sun: data.Sun.machines[1].shiftA,
        total: "",
      },
      {
        prodInfo:"Notes - A",
        mon: data.Mon.machines[1].notesA,
        tue: data.Tue.machines[1].notesA,
        wed: data.Wed.machines[1].notesA,
        thur: data.Thur.machines[1].notesA,
        fri: data.Fri.machines[1].notesA,
        sat: data.Sat.machines[1].notesA,
        sun: data.Sun.machines[1].notesA,
        total: "",
            
      },
      {
        prodInfo:"Beam Number",
        mon: data.Mon.machines[1].beamA,
        tue: data.Tue.machines[1].beamA,
        wed: data.Wed.machines[1].beamA,
        thur: data.Thur.machines[1].beamA,
        fri: data.Fri.machines[1].beamA,
        sat: data.Sat.machines[1].beamA,
        sun: data.Sun.machines[1].beamA,
        total: "",
      },
      {
        prodInfo:"Shift B",
        mon: data.Mon.machines[1].shiftB,
        tue: data.Tue.machines[1].shiftB,
        wed: data.Wed.machines[1].shiftB,
        thur: data.Thur.machines[1].shiftB,
        fri: data.Fri.machines[1].shiftB,
        sat: data.Sat.machines[1].shiftB,
        sun: data.Sun.machines[1].shiftB,
        total: "",
      },
      {
        prodInfo:"Notes B",
        mon: data.Mon.machines[1].notesB,
        tue: data.Tue.machines[1].notesB,
        wed: data.Wed.machines[1].notesB,
        thur: data.Thur.machines[1].notesB,
        fri: data.Fri.machines[1].notesB,
        sat: data.Sat.machines[1].notesB,
        sun: data.Sun.machines[1].notesB,
        total: "",
      },
      {
        prodInfo:"Article",            
        mon: data.Mon.machines[1].article,
        tue: data.Tue.machines[1].article,
        wed: data.Wed.machines[1].article,
        thur: data.Thur.machines[1].article,
        fri: data.Fri.machines[1].article,
        sat: data.Sat.machines[1].article,
        sun: data.Sun.machines[1].article,
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: data.Mon.machines[1].beamB,
        tue: data.Tue.machines[1].beamB,
        wed: data.Wed.machines[1].beamB,
        thur: data.Thur.machines[1].beamB,
        fri: data.Fri.machines[1].beamB,
        sat: data.Sat.machines[1].beamB,
        sun: data.Sun.machines[1].beamB,
        total: "",
      },
      
    ],
  },
     {
    machine: "Machine No: 2",
    rows: [
      {
        prodInfo:"Machine 2 Shift A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes - A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Shift B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Article",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      
    ],
  },
     {
    machine: "Machine No: 3",
    rows: [
      {
        prodInfo:"Machine 3 Shift A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes - A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Shift B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Article",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      
    ],
  },
     {
    machine: "Machine No: 4",
    rows: [
      {
        prodInfo:"Machine 4 Shift A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes - A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Shift B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Article",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      
    ],
  },{
    
    rows: [
      {
        prodInfo:"Daily  Total",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      
      
    ],
  },
   
    ]
  }

  

    
  

        
  
return { steps, loading, error };



}
