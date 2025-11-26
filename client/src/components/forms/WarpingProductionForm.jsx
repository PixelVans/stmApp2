"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { saveWarpingData, fetchWarpingDataByDate } from "@/api/dyeingApi";
import { toast } from "sonner";

// FUNC to format date 
function formatTodayDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("en-US", { month: "short" });
  const year = today.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month} ${year}`;
}

export default function WarpingProductionForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [formData, setFormData] = useState({
    beamNumber: "",
    date: new Date().toISOString().split("T")[0],
    machineNumber: "",
    beamPosition: "",
    meters: "",
    article: "",
    yarnCount1: "20/2",
    yarnCount2: "",
    totalEnds: "",
    weightYarn1: "",
    weightYarn2: "",
    beamUnitCounter: "",
  });

  // Tracks whether row exists → update instead of insert
  const [hasExistingRow, setHasExistingRow] = useState(false);

  // Auto-load when date changes
useEffect(() => {
  async function loadData() {
    setLoading(true);   // 1. Set loading true immediately
    setError(false);

    try {
      const data = await fetchWarpingDataByDate(formData.date);

      if (data.length > 0) {
        const row = data[0];
        setHasExistingRow(true);

        setFormData({
          beamNumber: row.BeamNumber || "",
          date: formData.date,
          machineNumber: row.MachineNumber?.toString() || "",
          beamPosition: row.BeamPosition || "",
          article: row.Article || "",
          yarnCount1: row.Yarn1 || "",
          yarnCount2: row.Yarn2 || "",
          totalEnds: row.TotalEnds || "",
          meters: row.Meters || "",
          weightYarn1: row.WeightofYarn1 || "",
          weightYarn2: row.WeightofYarn2 || "",
          beamUnitCounter: row.KnottingCounter || "",
        });
      } else {
        setHasExistingRow(false);
        handleReset(false); 
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false); 
    }
  }

  loadData();
}, [formData.date]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await saveWarpingData(formData, hasExistingRow);

      toast.success(
        hasExistingRow
          ? "Warping data updated successfully!"
          : "Warping data inserted successfully!"
      );

      handleReset(false); // DO NOT reset date after submit
;

    } catch (error) {
  console.error("Error saving warping data:", error);

  // Try to get backend message
  let errorMessage = "Failed to save data";

  if (error?.message) {
    errorMessage = error.message;
  }
if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
  }

  toast.error(errorMessage);
}

  };

  const handleReset = (resetDate = true) => {
    setFormData({
      beamNumber: "",
      date: resetDate ? new Date().toISOString().split("T")[0] : formData.date,
      machineNumber: "",
      beamPosition: "",
      meters: "",
      article: "",
      yarnCount1: "20/2",
      yarnCount2: "",
      totalEnds: "",
      weightYarn1: "",
      weightYarn2: "",
      beamUnitCounter: "",
    });
  };

  const machineNumbers = ["1", "2", "3", "4"];
  const beamPositions = ["Ground", "Pile"];
  const articleOptions = [
    '72" Wide Cellular',
    '63" Wide Counter Pane',
    '90" Wide Counter Pane',
    '30" Wide Towel',
    '40" Wide Towel',
    '20" Wide Towel',
    '12" Wide Towel',
    '90" Wide Bed Sheet',
  ];

  const yarnCounts1 = ["20/2", "9/4", "6/4", "6/2", "13.5/6", "24/2", "30/2 PC"];
  const yarnCounts2 = ["24/2 Dyed", "13.5/6", "9/4", "6/4", "6/2"];

  const inputStyle =
    "w-full border border-slate-400 bg-slate-50 text-slate-800 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";


    // Render loading
    if (loading) {
        return (
        <div className="flex flex-col mt-[170px] items-center justify-center  bg-white">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-6 bg-blue-500 rounded animate-[wave_1.2s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
  
          <p className="mt-6 text-lg font-semibold text-gray-800">
            Loading Warping Production Data..
          </p>
          
        <style>{`
            @keyframes wave {
              0%, 40%, 100% { transform: scaleY(0.4); } 
              20% { transform: scaleY(1.0); }
            }
          `}</style>
        </div>
      );
    }
  
    // Render error
    if (error)
      return (
        <div className="flex flex-col items-center justify-center mt-36 text-center">
          <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
          <p className="text-gray-700 font-medium mb-2">
            Failed to load Warping Production Data.
          </p>
          <Button onClick={fetchWarpingDataByDate} variant="outline">
            Retry
          </Button>
        </div>
      );
  
    return (
    <div className="relative max-w-4xl mx-auto py-5 px-5 md:px-8 mt-2 shadow-md shadow-slate-500 rounded-lg bg-white">

      <div className="absolute top-3 right-4 text-xs font-medium text-slate-600">
        {formatTodayDate()}
      </div>

      <h1 className="text-lg sm:text-xl font-bold text-center mb-4">
        Update Warping Production
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Machine Number</label>
              <select
                required
                value={formData.machineNumber}
                onChange={(e) =>
                  setFormData({ ...formData, machineNumber: e.target.value })
                }
                className={inputStyle}
              >
                <option value="">Select</option>
                {machineNumbers.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Beam Position</label>
              <select
                required
                value={formData.beamPosition}
                onChange={(e) =>
                  setFormData({ ...formData, beamPosition: e.target.value })
                }
                className={inputStyle}
              >
                <option value="">Select</option>
                {beamPositions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Article</label>
              <select
                required
                value={formData.article}
                onChange={(e) =>
                  setFormData({ ...formData, article: e.target.value })
                }
                className={inputStyle}
              >
                <option value="">Select</option>
                {articleOptions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Beam Number</label>
              <input
                required
                type="text"
                value={formData.beamNumber}
                onChange={(e) =>
                  setFormData({ ...formData, beamNumber: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Meters</label>
              <input
                required
                type="number"
                value={formData.meters}
                onChange={(e) =>
                  setFormData({ ...formData, meters: e.target.value })
                }
                className={inputStyle}
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-3">

            <div>
              <label className="text-sm font-medium">Yarn Count 1</label>
              <select
                required
                value={formData.yarnCount1}
                onChange={(e) =>
                  setFormData({ ...formData, yarnCount1: e.target.value })
                }
                className={inputStyle}
              >
                {yarnCounts1.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Yarn Count 2</label>
              <select
                value={formData.yarnCount2}
                onChange={(e) =>
                  setFormData({ ...formData, yarnCount2: e.target.value })
                }
                className={inputStyle}
              >
                <option value="">Select</option>
                {yarnCounts2.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Total Ends</label>
              <input
                required
                type="number"
                value={formData.totalEnds}
                onChange={(e) =>
                  setFormData({ ...formData, totalEnds: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Weight Yarn 1 (Kg)</label>
              <input
                required
                type="number"
                value={formData.weightYarn1}
                onChange={(e) =>
                  setFormData({ ...formData, weightYarn1: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Weight Yarn 2 (Kg)</label>
              <input
                type="number"
                value={formData.weightYarn2}
                onChange={(e) =>
                  setFormData({ ...formData, weightYarn2: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Beam Unit Counter</label>
              <input
                type="number"
                value={formData.beamUnitCounter}
                onChange={(e) =>
                  setFormData({ ...formData, beamUnitCounter: e.target.value })
                }
                className={inputStyle}
              />
            </div>

          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button type="button" variant="destructive" onClick={() => handleReset(false)}>
            Clear
          </Button>

          <Button type="submit">
            {hasExistingRow ? "Update" : "Submit"}
          </Button>
        </div>

      </form>
    </div>
  );
}
